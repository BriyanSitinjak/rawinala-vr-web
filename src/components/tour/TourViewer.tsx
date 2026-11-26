"use client";

import dynamic from "next/dynamic";
import type { AFrameSceneProps } from "./AFrameScene";

const AFrameScene = dynamic(() => import("./AFrameScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-forest-deep)] text-[var(--color-cream)]">
      <p className="text-sm tracking-wide">Memuat viewer 360°…</p>
    </div>
  ),
});

export function TourViewer(props: AFrameSceneProps) {
  return <AFrameScene {...props} />;
}
