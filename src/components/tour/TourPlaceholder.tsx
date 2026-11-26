"use client";

import { useEffect, useState } from "react";
import { getSceneById, siteContent, t } from "@/content/tour";

export function TourPlaceholder() {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveSceneId(params.get("scene"));

    const onNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ sceneId: string }>).detail;
      if (detail?.sceneId) {
        setActiveSceneId(detail.sceneId);
      }
    };

    window.addEventListener("tour:navigate", onNavigate);
    return () => window.removeEventListener("tour:navigate", onNavigate);
  }, []);

  const resolved = activeSceneId ? getSceneById(activeSceneId) : undefined;

  return (
    <section
      id="tour"
      aria-labelledby="tour-heading"
      className="scroll-mt-4 bg-[var(--color-mist)] px-6 py-20 sm:px-10 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="tour-heading"
          className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-ink)] sm:text-4xl"
        >
          {t(siteContent.tour.sectionHeading)}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
          {t(siteContent.tour.sectionIntro)}
        </p>

        <div className="mt-10 flex min-h-[280px] flex-col items-start justify-center rounded-2xl border border-dashed border-[var(--color-leaf)]/40 bg-[color-mix(in_srgb,var(--color-cream)_70%,transparent)] p-8">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-forest)]">
            {t(siteContent.tour.placeholderNote)}
          </p>
          {resolved ? (
            <p className="mt-4 text-lg text-[var(--color-ink)]">
              Siap membuka:{" "}
              <span className="font-semibold">{t(resolved.area.title)}</span>
              {" — "}
              <span>{t(resolved.scene.title)}</span>
            </p>
          ) : (
            <p className="mt-4 text-base text-[var(--color-ink-muted)]">
              Belum ada area dipilih. Gulir ke atas dan tekan &quot;Buka di
              Tur&quot;, atau tekan &quot;Mulai Kunjungan&quot;.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
