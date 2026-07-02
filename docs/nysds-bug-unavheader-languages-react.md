# NYSDS bug report — `NysUnavHeader` React wrapper drops the `languages` prop (renders crash / empty menu)

**Package:** `@nysds/components` v1.19.2 (React wrappers under `@nysds/components/react`)
**Environment:** React 18.3, Vite 5, TypeScript. Also reproduces in jsdom/Vitest.
**Severity:** High — crashes render of `nys-unavheader` when a custom `languages` array is supplied via the React wrapper.

## Summary

Passing a `languages` array to the `<NysUnavHeader>` React wrapper causes the underlying
`nys-unavheader` to receive `null` for `this.languages`, throwing during render:

```
TypeError: Cannot read properties of null (reading 'map')
    at NysUnavHeader.render (nys-unavheader.ts:375)  // this.languages.map(...)
```

## Root cause

The React wrapper `packages/react/NysUnavHeader.js` passes complex (object/array) props
**directly to `React.createElement`** instead of assigning them imperatively as element
**properties**:

```js
// packages/react/NysUnavHeader.js
return React.createElement("nys-unavheader", {
  ...filteredProps,
  searchUrl: props.searchUrl,
  languages: props.languages,   // ← array passed as a React prop
  ...
});
```

React 18 does not set arbitrary object/array values as JS **properties** on custom
elements; it serializes them to **attributes**. The array becomes an attribute string,
Lit's Array attribute converter runs `JSON.parse` on it, fails, and the property resolves
to `null` — overriding the component's default `languages` array. The next render calls
`this.languages.map(...)` on `null` and throws.

This wrapper is inconsistent with the other NYSDS wrappers (e.g. `NysButton`), which route
complex props through the `useProperties` helper (`packages/react/react-utils.js`) that
assigns them as element properties in a `useEffect`:

```js
// react-utils.js — the correct pattern, not used by NysUnavHeader
export function useProperties(targetElement, propName, value) {
  useEffect(() => {
    if (value !== undefined && targetElement.current &&
        targetElement.current[propName] !== value) {
      targetElement.current[propName] = value;
    }
  }, [value, targetElement]);
}
```

`NysUnavHeader.js` (and any wrapper passing object/array props inline) should use
`useProperties` for `languages` (and `searchUrl` if it is ever non-string).

## Reproduction

```tsx
import { NysUnavHeader } from "@nysds/components/react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export function Header() {
  return <NysUnavHeader hideSearch languages={LANGUAGES} />;
  // → render throws: this.languages.map is not a function / of null
}
```

## Expected

Supplying `languages` via the React wrapper sets the element's `languages` **property**
and the translate menu renders the supplied list.

## Workaround (in consumer code)

Set the property imperatively via a ref instead of passing it as a JSX prop:

```tsx
const ref = useRef<HTMLElement>(null);
useEffect(() => {
  if (ref.current) {
    (ref.current as unknown as { languages: typeof LANGUAGES }).languages = LANGUAGES;
  }
}, []);
return <NysUnavHeader ref={ref} hideSearch />;
```

## Suggested fix

In `packages/react/NysUnavHeader.js`, stop passing `languages` (and other non-primitive
props) through `createElement`; destructure them out of the element props and assign via
`useProperties(ref, "languages", props.languages)`, matching `NysButton` and the other
wrappers. A codebase-wide audit for wrappers that pass object/array props inline is
recommended, since the same class of bug will affect any of them.

## Related (same under-implemented wrapper)

The `NysUnavHeader` React wrapper has two further gaps that compound the above:

1. **`ref` is not forwarded.** The wrapper accepts `forwardedRef` in its `forwardRef`
   signature but never applies it to the element (compare `NysButton.js`, which sets
   `forwardedRef.current = node` via a ref callback). So `ref.current` is always `null`,
   which also defeats the "set `languages` imperatively via ref" workaround above. As a
   result, consumers must bind the `nys-language-select` event on a **wrapping element**
   (the event is `bubbles: true, composed: true`) and rely on the component's default
   `languages` list.

2. **No event props.** `nys-language-select` is not surfaced as an `onNys*` prop on the
   wrapper type (`NysUnavHeader.d.ts` only picks `onClick/onFocus/onBlur`). Consider
   generating event props for documented component events, matching other wrappers.

Both, plus the `languages` bug, point to `NysUnavHeader.js` being generated/authored
differently from the other wrappers — an audit and regeneration is recommended.
