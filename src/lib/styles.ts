/** Shared focus-visible rings (pairs with global :focus-visible). */
export const focusRing = {
  sun: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-sun)]",
  cream:
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-cream)]",
  forest:
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]",
} as const;

export const overlayChip =
  "rounded-md bg-[color-mix(in_srgb,var(--color-forest-deep)_78%,transparent)] text-[var(--color-cream)] backdrop-blur-sm";
