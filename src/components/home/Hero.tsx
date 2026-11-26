"use client";

import Image from "next/image";
import { siteContent, t } from "@/content/tour";
import { scrollToId } from "@/lib/scroll";
import { focusRing } from "@/lib/styles";

export function Hero() {
  const { brandName, heroParagraph, ctaStartTour } = siteContent.home;

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden text-[var(--color-cream)]">
      <Image
        src="/demo/hero-atmosphere.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,rgba(28,58,48,0.82)_0%,rgba(36,72,58,0.55)_45%,rgba(20,40,34,0.88)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:28px_28px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20">
        <p className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.02em] animate-[fade-rise_0.9s_ease-out_both]">
          {brandName}
        </p>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--color-cream)_88%,transparent)] sm:text-lg animate-[fade-rise_0.9s_ease-out_0.15s_both]">
          {t(heroParagraph)}
        </p>
        <div className="mt-8 animate-[fade-rise_0.9s_ease-out_0.3s_both]">
          <button
            type="button"
            onClick={() => scrollToId("tour")}
            className={`inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--color-sun)] px-6 text-base font-semibold text-[var(--color-ink)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-sun-bright)] ${focusRing.cream}`}
          >
            {t(ctaStartTour)}
          </button>
        </div>
      </div>
    </header>
  );
}
