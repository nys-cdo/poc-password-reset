import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { html as staticHtml, literal, type StaticValue } from "lit/static-html.js";

/**
 * `nys-card` — a flexible content card built to NYSDS engineering standards.
 * Custom because NYSDS ships no card component (PRD §10.2); this is an upstream
 * candidate. Anatomy follows the DS card architecture spec:
 *
 *   media (+ overlapping accent) → top slot → preheading → heading →
 *   subheading → description → default slot → footer slot (CTA)
 *
 * Styling uses NYSDS design tokens (--nys-*) only — no raw hex/px/rem.
 * Logical properties keep it RTL-safe (PRD §11).
 *
 * Written decorator-free (static `properties` + constructor init) so it
 * transpiles cleanly under Vite/esbuild regardless of `useDefineForClassFields`.
 */
export class NysCard extends LitElement {
  static properties = {
    preheading: { type: String },
    heading: { type: String },
    subheading: { type: String },
    description: { type: String },
    headingLevel: { type: Number, attribute: "heading-level" },
    variant: { type: String, reflect: true },
    _hasMedia: { state: true },
    _hasAccent: { state: true },
    _hasTop: { state: true },
    _hasFooter: { state: true },
  };

  declare preheading: string;
  declare heading: string;
  declare subheading: string;
  declare description: string;
  /** Heading element level (2–6) for correct document outline. Default 3. */
  declare headingLevel: number;
  /** Visual style: `bordered` (default) or `elevated`. */
  declare variant: "bordered" | "elevated";
  declare private _hasMedia: boolean;
  declare private _hasAccent: boolean;
  declare private _hasTop: boolean;
  declare private _hasFooter: boolean;

  constructor() {
    super();
    this.preheading = "";
    this.heading = "";
    this.subheading = "";
    this.description = "";
    this.headingLevel = 3;
    this.variant = "bordered";
    this._hasMedia = false;
    this._hasAccent = false;
    this._hasTop = false;
    this._hasFooter = false;
  }

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      block-size: 100%;
    }

    .card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      block-size: 100%;
      background: var(--nys-color-surface);
      border: var(--nys-border-width-sm) solid var(--nys-color-neutral-200);
      border-radius: var(--nys-radius-xl);
      color: var(--nys-color-text);
    }

    /* Raised cards keep the hairline border and add the NYSDS raised elevation
       (--nys-shadow-raised === 0 4px 6px -1px @10% + 0 4px 6px -1px @1%). */
    :host([variant="elevated"]) .card {
      box-shadow: var(--nys-shadow-raised);
    }

    .card__media {
      position: relative;
      display: block;
    }

    .card__media ::slotted(img),
    .card__media ::slotted(picture) {
      display: block;
      inline-size: 100%;
      block-size: auto;
    }

    .card__accent {
      position: absolute;
      inset-block-end: var(--nys-space-200);
      inset-inline-end: var(--nys-space-200);
      z-index: 1;
    }

    .card__body {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--nys-space-100);
      padding: var(--nys-space-300);
    }

    .card__top {
      margin-block-end: var(--nys-space-100);
    }

    .card__preheading {
      margin: 0;
      font-family: var(--nys-font-family-ui);
      font-size: var(--nys-font-size-ui-sm);
      line-height: var(--nys-font-lineheight-ui-sm);
      letter-spacing: var(--nys-font-letterspacing-ui-sm);
      color: var(--nys-color-text-weak);
    }

    .card__heading {
      margin: 0;
      font-family: var(--nys-font-family-heading);
      font-size: var(--nys-font-size-h3);
      line-height: var(--nys-font-lineheight-h3);
      font-weight: var(--nys-font-weight-bold);
      color: var(--nys-color-text);
    }

    .card__subheading {
      margin: 0;
      font-family: var(--nys-font-family-body);
      font-size: var(--nys-font-size-body-md);
      line-height: var(--nys-font-lineheight-body-md);
      color: var(--nys-color-text-weak);
    }

    .card__description {
      margin: 0;
      font-family: var(--nys-font-family-body);
      font-size: var(--nys-font-size-body-md);
      line-height: var(--nys-font-lineheight-body-md);
      color: var(--nys-color-text);
    }

    .card__content:not(:empty) {
      margin-block-start: var(--nys-space-100);
    }

    .card__footer {
      margin-block-start: auto;
      padding-block-start: var(--nys-space-300);
    }
  `;

  private _onSlotChange(name: "media" | "accent" | "top" | "footer", event: Event) {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim() !== "";
    });
    if (name === "media") this._hasMedia = has;
    else if (name === "accent") this._hasAccent = has;
    else if (name === "top") this._hasTop = has;
    else this._hasFooter = has;
  }

  private _headingTag(): StaticValue {
    switch (this.headingLevel) {
      case 2:
        return literal`h2`;
      case 4:
        return literal`h4`;
      case 5:
        return literal`h5`;
      case 6:
        return literal`h6`;
      default:
        return literal`h3`;
    }
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("headingLevel")) {
      const level = Number(this.headingLevel);
      if (!Number.isInteger(level) || level < 2 || level > 6) {
        this.headingLevel = 3;
      }
    }
  }

  render() {
    const tag = this._headingTag();
    const headingBlock = this.heading
      ? staticHtml`<${tag} class="card__heading">${this.heading}</${tag}>`
      : nothing;

    return html`
      <article class="card">
        <div
          class="card__media"
          part="media"
          ?hidden=${!this._hasMedia && !this._hasAccent}
        >
          <slot
            name="media"
            @slotchange=${(e: Event) => this._onSlotChange("media", e)}
          ></slot>
          <div class="card__accent" part="accent" ?hidden=${!this._hasAccent}>
            <slot
              name="accent"
              @slotchange=${(e: Event) => this._onSlotChange("accent", e)}
            ></slot>
          </div>
        </div>

        <div class="card__body" part="body">
          <div class="card__top" part="top" ?hidden=${!this._hasTop}>
            <slot
              name="top"
              @slotchange=${(e: Event) => this._onSlotChange("top", e)}
            ></slot>
          </div>

          ${this.preheading
            ? html`<p class="card__preheading">${this.preheading}</p>`
            : nothing}
          ${headingBlock}
          ${this.subheading
            ? html`<p class="card__subheading">${this.subheading}</p>`
            : nothing}
          ${this.description
            ? html`<p class="card__description">${this.description}</p>`
            : nothing}

          <div class="card__content" part="content">
            <slot></slot>
          </div>

          <div class="card__footer" part="footer" ?hidden=${!this._hasFooter}>
            <slot
              name="footer"
              @slotchange=${(e: Event) => this._onSlotChange("footer", e)}
            ></slot>
          </div>
        </div>
      </article>
    `;
  }
}

if (!customElements.get("nys-card")) {
  customElements.define("nys-card", NysCard);
}

declare global {
  interface HTMLElementTagNameMap {
    "nys-card": NysCard;
  }
}
