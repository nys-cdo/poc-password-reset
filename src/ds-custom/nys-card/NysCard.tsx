import React, { forwardRef } from "react";

import "./nys-card";

export interface NysCardProps {
  preheading?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  /** Heading element level (2–6) for correct document outline. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  variant?: "bordered" | "elevated";
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Thin React wrapper for the `nys-card` Lit element. All props are primitives,
 * so React sets them as attributes safely (no object/array prop hazard). The
 * numeric `headingLevel` maps to the `heading-level` attribute.
 */
export const NysCard = forwardRef<HTMLElement, NysCardProps>(function NysCard(
  { preheading, heading, subheading, description, headingLevel, variant, id, className, style, children },
  ref,
) {
  return React.createElement(
    "nys-card",
    {
      ref,
      id,
      class: className,
      style,
      preheading,
      heading,
      subheading,
      description,
      "heading-level": headingLevel,
      variant,
    },
    children,
  );
});
