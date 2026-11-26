"use client";

import { siteContent, t } from "@/content/tour";
import type { TourArea } from "@/types/tour";

type InfoPanelProps = {
  open: boolean;
  area: TourArea | undefined;
  onClose: () => void;
};

/** Phase 2: description only. Photos + videos arrive in Phase 3. */
export function InfoPanel({ open, area, onClose }: InfoPanelProps) {
  if (!open || !area) return null;

  return (
    <div
      className="absolute inset-0 z-20 flex items-end justify-end sm:items-stretch"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-info-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_45%,transparent)]"
        aria-label={t(siteContent.tour.closeInfo)}
        onClick={onClose}
      />
      <aside className="relative z-10 flex max-h-[70vh] w-full flex-col rounded-t-2xl bg-[var(--color-cream)] p-5 text-[var(--color-ink)] shadow-2xl sm:max-h-none sm:w-[min(100%,22rem)] sm:rounded-none sm:rounded-l-2xl">
        <div className="flex items-start justify-between gap-3">
          <h3
            id="tour-info-title"
            className="font-[family-name:var(--font-display)] text-2xl"
          >
            {t(area.title)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-md text-xl leading-none text-[var(--color-ink-muted)] hover:bg-[var(--color-sand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
            aria-label={t(siteContent.tour.closeInfo)}
          >
            ×
          </button>
        </div>
        <p className="mt-4 overflow-y-auto text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
          {t(area.description)}
        </p>
      </aside>
    </div>
  );
}
