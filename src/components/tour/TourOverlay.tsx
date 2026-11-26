"use client";

import Image from "next/image";
import type { KeyboardEvent, RefObject } from "react";
import { siteContent, t } from "@/content/tour";
import { focusRing, overlayChip } from "@/lib/styles";
import type { TourScene } from "@/types/tour";

export type SceneOption = {
  areaTitle: string;
  scene: TourScene;
};

type TourOverlayProps = {
  visible: boolean;
  scenes: SceneOption[];
  activeSceneId: string;
  showHint: boolean;
  onSelectScene: (sceneId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onInfo: () => void;
  infoButtonRef?: RefObject<HTMLButtonElement | null>;
};

export function TourOverlay({
  visible,
  scenes,
  activeSceneId,
  showHint,
  onSelectScene,
  onPrev,
  onNext,
  onInfo,
  infoButtonRef,
}: TourOverlayProps) {
  if (!visible) return null;

  const ui = siteContent.tour;
  const active = scenes.find((s) => s.scene.id === activeSceneId);
  const navBtn = `min-h-10 min-w-10 px-4 text-sm font-medium ${overlayChip} ${focusRing.sun}`;

  const onStripKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      if (scenes[0]) onSelectScene(scenes[0].scene.id);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = scenes[scenes.length - 1];
      if (last) onSelectScene(last.scene.id);
    }
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4"
      aria-label={t(ui.sectionHeading)}
    >
      <div className="pointer-events-auto flex items-start justify-between gap-3">
        <div
          className="max-w-[70%] rounded-md bg-[color-mix(in_srgb,var(--color-forest-deep)_72%,transparent)] px-3 py-2 text-[var(--color-cream)] backdrop-blur-sm"
          aria-live="polite"
        >
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-sun)]">
            {active?.areaTitle}
          </p>
          <p className="font-[family-name:var(--font-display)] text-lg leading-tight">
            {active ? t(active.scene.title) : ""}
          </p>
        </div>
        <button
          ref={infoButtonRef}
          type="button"
          onClick={onInfo}
          className={`min-h-10 rounded-md bg-[var(--color-sun)] px-4 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition hover:bg-[var(--color-sun-bright)] ${focusRing.cream}`}
          aria-label={t(ui.infoButton)}
        >
          {t(ui.infoButton)}
        </button>
      </div>

      {showHint && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="animate-[fade-rise_0.8s_ease-out_both] rounded-full bg-[color-mix(in_srgb,var(--color-forest-deep)_70%,transparent)] px-4 py-2 text-sm text-[var(--color-cream)] backdrop-blur-sm">
            {t(ui.dragHint)}
          </p>
        </div>
      )}

      <div className="pointer-events-auto flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className={navBtn}
            aria-label={t(ui.prevScene)}
          >
            ←
          </button>
          <button
            type="button"
            onClick={onNext}
            className={navBtn}
            aria-label={t(ui.nextScene)}
          >
            →
          </button>
        </div>

        <div
          className={`overflow-x-auto p-2 ${overlayChip}`}
          role="listbox"
          tabIndex={0}
          aria-label={t(ui.sceneThumbLabel)}
          aria-activedescendant={
            active ? `tour-scene-${active.scene.id}` : undefined
          }
          onKeyDown={onStripKeyDown}
        >
          <ul className="flex w-max gap-2">
            {scenes.map(({ scene, areaTitle }) => {
              const selected = scene.id === activeSceneId;
              return (
                <li key={scene.id}>
                  <button
                    id={`tour-scene-${scene.id}`}
                    type="button"
                    role="option"
                    tabIndex={selected ? 0 : -1}
                    aria-selected={selected}
                    aria-label={`${areaTitle}: ${t(scene.title)}`}
                    onClick={() => onSelectScene(scene.id)}
                    className={`relative h-16 w-24 overflow-hidden rounded-md ring-2 transition ${focusRing.sun} ${
                      selected
                        ? "ring-[var(--color-sun)]"
                        : "ring-transparent opacity-85 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={scene.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
