"use client";

import { siteContent, t } from "@/content/tour";

type VideoControlsProps = {
  visible: boolean;
  title: string;
  playing: boolean;
  muted: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onClose: () => void;
};

export function VideoControls({
  visible,
  title,
  playing,
  muted,
  onPlayPause,
  onMuteToggle,
  onClose,
}: VideoControlsProps) {
  if (!visible) return null;

  const ui = siteContent.tour;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-forest-deep)_82%,transparent)] px-3 py-3 text-[var(--color-cream)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate px-1 text-sm font-medium">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPlayPause}
            className="min-h-10 rounded-md bg-[var(--color-sun)] px-4 text-sm font-semibold text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
            aria-label={playing ? t(ui.pauseVideo) : t(ui.playVideo)}
          >
            {playing ? t(ui.pauseVideo) : t(ui.playVideo)}
          </button>
          <button
            type="button"
            onClick={onMuteToggle}
            className="min-h-10 rounded-md bg-[color-mix(in_srgb,var(--color-cream)_18%,transparent)] px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-sun)]"
            aria-label={muted ? t(ui.unmuteVideo) : t(ui.muteVideo)}
          >
            {muted ? t(ui.unmuteVideo) : t(ui.muteVideo)}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md bg-[color-mix(in_srgb,var(--color-cream)_18%,transparent)] px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-sun)]"
            aria-label={t(ui.closeVideo)}
          >
            {t(ui.closeVideo)}
          </button>
        </div>
      </div>
    </div>
  );
}
