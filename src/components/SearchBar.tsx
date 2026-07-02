import { NysButton, NysTextinput } from "@nysds/components/react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  buttonLabel: string;
}

/**
 * KB search field: `nys-textinput` (type=search) with a trailing search button
 * in the `endButton` slot. Filters live via `onNysInput` (PRD §13.3).
 */
export function SearchBar({ value, onChange, label, placeholder, buttonLabel }: SearchBarProps) {
  return (
    <NysTextinput
      type="search"
      label={label}
      placeholder={placeholder}
      value={value}
      onNysInput={(event) => {
        if (event instanceof CustomEvent) onChange(event.detail.value as string);
      }}
    >
      <NysButton slot="endButton" prefixIcon="search" circle ariaLabel={buttonLabel} />
    </NysTextinput>
  );
}
