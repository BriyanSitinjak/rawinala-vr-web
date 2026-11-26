"use client";

import { useEffect, useRef } from "react";
import { siteContent, t } from "@/content/tour";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { focusRing } from "@/lib/styles";

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
  const playRef = useRef<HTMLButtonElement | null>(null);
  const ui = siteContent.tour;

  useEscapeKey(onClose, visible);

  useEffect(() => {
    if (!visible) return;
    playRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "k") return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
      event.preventDefault();
      onPlayPause();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, onPlayPause]);

  if (!visible) return null;

  const ghostBtn = `min-h-10 rounded-md bg-[color-mix(in_srgb,var(--color-cream)_18%,transparent)] px-4 text-sm font-medium ${focusRing.sun}`;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-4"
      role="toolbar"
      aria-label={title}
    >
      <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-forest-deep)_82%,transparent)] px-3 py-3 text-[var(--color-cream)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate px-1 text-sm font-medium">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            ref={playRef}
            type="button"
            onClick={onPlayPause}
            className={`min-h-10 rounded-md bg-[var(--color-sun)] px-4 text-sm font-semibold text-[var(--color-ink)] ${focusRing.cream}`}
            aria-label={playing ? t(ui.pauseVideo) : t(ui.playVideo)}
            aria-pressed={playing}
          >
            {playing ? t(ui.pauseVideo) : t(ui.playVideo)}
          </button>
          <button
            type="button"
            onClick={onMuteToggle}
            className={ghostBtn}
            aria-label={muted ? t(ui.unmuteVideo) : t(ui.muteVideo)}
            aria-pressed={muted}
          >
            {muted ? t(ui.unmuteVideo) : t(ui.muteVideo)}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={ghostBtn}
            aria-label={t(ui.closeVideo)}
          >
            {t(ui.closeVideo)}
          </button>
        </div>
      </div>
    </div>
  );
}
