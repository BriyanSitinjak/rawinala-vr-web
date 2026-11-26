"use client";

import Image from "next/image";
import { siteContent, t } from "@/content/tour";
import { openTourScene } from "@/lib/tourUrl";
import { focusRing } from "@/lib/styles";

export function AreaCards() {
  const { areasHeading, areasIntro, openAreaCta } = siteContent.home;

  return (
    <section
      id="areas"
      aria-labelledby="areas-heading"
      className="relative bg-[var(--color-sand)] px-6 py-20 sm:px-10 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(28,58,48,0.08),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <h2
          id="areas-heading"
          className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-ink)] sm:text-4xl"
        >
          {t(areasHeading)}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
          {t(areasIntro)}
        </p>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {siteContent.areas.map((area, index) => {
            const thumb = area.scenes[0]?.thumbnail ?? "/demo/kelas-1-thumb.jpg";
            const firstSceneId = area.scenes[0]?.id;
            return (
              <li
                key={area.id}
                className="group animate-[fade-rise_0.7s_ease-out_both]"
                style={{ animationDelay: `${0.08 * index}s` }}
              >
                <article className="overflow-hidden rounded-xl bg-[var(--color-cream)] shadow-[0_18px_40px_-28px_rgba(28,58,48,0.45)] ring-1 ring-[var(--color-leaf)]/15">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                        {t(area.title)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
                        {t(area.shortDescription)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!firstSceneId}
                      onClick={() =>
                        firstSceneId && openTourScene(firstSceneId, area.id)
                      }
                      aria-label={`${t(openAreaCta)}: ${t(area.title)}`}
                      className={`inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-[var(--color-forest)] px-5 text-sm font-semibold text-[var(--color-cream)] transition hover:bg-[var(--color-forest-deep)] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing.forest}`}
                    >
                      {t(openAreaCta)}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
