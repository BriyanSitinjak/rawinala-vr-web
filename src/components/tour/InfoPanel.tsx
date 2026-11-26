"use client";

import Image from "next/image";
import { siteContent, t } from "@/content/tour";
import type { TourArea, TourVideo } from "@/types/tour";

type InfoPanelProps = {
  open: boolean;
  area: TourArea | undefined;
  onClose: () => void;
  onSelectVideo: (video: TourVideo) => void;
};

export function InfoPanel({
  open,
  area,
  onClose,
  onSelectVideo,
}: InfoPanelProps) {
  if (!open || !area) return null;

  const ui = siteContent.tour;

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
        aria-label={t(ui.closeInfo)}
        onClick={onClose}
      />
      <aside className="relative z-10 flex max-h-[75vh] w-full flex-col rounded-t-2xl bg-[var(--color-cream)] text-[var(--color-ink)] shadow-2xl sm:max-h-none sm:w-[min(100%,24rem)] sm:rounded-none sm:rounded-l-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-sand)] px-5 py-4">
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
            aria-label={t(ui.closeInfo)}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
            {t(area.description)}
          </p>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-forest)]">
            {t(ui.photosHeading)}
          </h4>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {area.photos.map((photo) => (
              <li
                key={photo.src + t(photo.alt)}
                className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--color-sand)]"
              >
                <Image
                  src={photo.src}
                  alt={t(photo.alt)}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-forest)]">
            {t(ui.videosHeading)}
          </h4>
          <ul className="mt-3 space-y-2">
            {area.videos.map((video) => (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => onSelectVideo(video)}
                  className="flex w-full items-center gap-3 rounded-md bg-[var(--color-sand)] p-2 text-left transition hover:bg-[color-mix(in_srgb,var(--color-leaf)_25%,var(--color-sand))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
                    <Image
                      src={video.poster}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {t(video.title)}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                      {t(ui.playVideo)} · 360°
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
