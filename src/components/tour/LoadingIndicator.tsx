"use client";

import { siteContent, t } from "@/content/tour";

type LoadingIndicatorProps = {
  visible: boolean;
};

export function LoadingIndicator({ visible }: LoadingIndicatorProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-forest-deep)_55%,transparent)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-full bg-[color-mix(in_srgb,var(--color-forest-deep)_85%,transparent)] px-5 py-3 text-[var(--color-cream)] backdrop-blur-sm">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-cream)] border-t-transparent"
          aria-hidden
        />
        <span className="text-sm font-medium">
          {t(siteContent.tour.loadingPanorama)}
        </span>
      </div>
    </div>
  );
}
