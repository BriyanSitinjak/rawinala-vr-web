"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllScenes,
  getSceneById,
  siteContent,
  t,
} from "@/content/tour";
import { readTourParams, syncTourUrl } from "@/lib/tourUrl";
import type { TourVideo } from "@/types/tour";
import { InfoPanel } from "./InfoPanel";
import { TourOverlay } from "./TourOverlay";
import { TourViewer } from "./TourViewer";
import { VideoControls } from "./VideoControls";

const DEFAULT_SCENE_ID = siteContent.areas[0]?.scenes[0]?.id ?? "eksterior-1";
const DEBUG = process.env.NEXT_PUBLIC_TOUR_DEBUG === "true";

export function TourShell() {
  const allScenes = useMemo(() => getAllScenes(), []);
  const sceneOptions = useMemo(
    () =>
      allScenes.map(({ area, scene }) => ({
        areaTitle: t(area.title),
        scene,
      })),
    [allScenes],
  );

  const [sceneId, setSceneId] = useState(DEFAULT_SCENE_ID);
  const [isVr, setIsVr] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<TourVideo | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  const resolved = getSceneById(sceneId) ?? getSceneById(DEFAULT_SCENE_ID);
  const activeArea = resolved?.area;
  const activeScene = resolved?.scene;

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    setVideoPlaying(false);
    setVideoMuted(true);
  }, []);

  const goToScene = useCallback(
    (nextSceneId: string) => {
      const match = getSceneById(nextSceneId);
      if (!match) return;
      closeVideo();
      setSceneId(nextSceneId);
      syncTourUrl(nextSceneId, match.area.id);
    },
    [closeVideo],
  );

  useEffect(() => {
    const { sceneId: fromUrl } = readTourParams();
    if (fromUrl && getSceneById(fromUrl)) {
      setSceneId(fromUrl);
    }
  }, []);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ sceneId: string }>).detail;
      if (detail?.sceneId) {
        goToScene(detail.sceneId);
      }
    };
    const onExitVideo = () => closeVideo();

    window.addEventListener("tour:navigate", onNavigate);
    window.addEventListener("tour:exit-video", onExitVideo);
    return () => {
      window.removeEventListener("tour:navigate", onNavigate);
      window.removeEventListener("tour:exit-video", onExitVideo);
    };
  }, [goToScene, closeVideo]);

  const activeIndex = allScenes.findIndex((s) => s.scene.id === sceneId);

  const goPrev = () => {
    if (allScenes.length === 0) return;
    const index = (activeIndex - 1 + allScenes.length) % allScenes.length;
    goToScene(allScenes[index].scene.id);
  };

  const goNext = () => {
    if (allScenes.length === 0) return;
    const index = (activeIndex + 1) % allScenes.length;
    goToScene(allScenes[index].scene.id);
  };

  const handleSelectVideo = (video: TourVideo) => {
    setInfoOpen(false);
    setActiveVideo(video);
    setVideoMuted(true);
    setVideoPlaying(false);
  };

  if (!activeScene || !activeArea) {
    return null;
  }

  const inVideo = Boolean(activeVideo);

  return (
    <section
      id="tour"
      aria-labelledby="tour-heading"
      className="scroll-mt-4 bg-[var(--color-mist)] px-6 py-16 sm:px-10 sm:py-20"
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

        <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-32px_rgba(28,58,48,0.55)] sm:aspect-[16/10] lg:aspect-[16/9]">
          <TourViewer
            imageSrc={activeScene.image}
            links={activeArea.links}
            sceneId={activeScene.id}
            debug={DEBUG}
            videoSrc={activeVideo?.src ?? null}
            videoPlaying={videoPlaying}
            videoMuted={videoMuted}
            onEnterVr={() => {
              setIsVr(true);
              setInfoOpen(false);
            }}
            onExitVr={() => setIsVr(false)}
            onUserInteract={() => setShowHint(false)}
            onVideoPlayingChange={setVideoPlaying}
          />
          <TourOverlay
            visible={!isVr && !inVideo}
            scenes={sceneOptions}
            activeSceneId={activeScene.id}
            showHint={showHint}
            onSelectScene={goToScene}
            onPrev={goPrev}
            onNext={goNext}
            onInfo={() => setInfoOpen(true)}
          />
          <VideoControls
            visible={!isVr && inVideo && Boolean(activeVideo)}
            title={activeVideo ? t(activeVideo.title) : ""}
            playing={videoPlaying}
            muted={videoMuted}
            onPlayPause={() => setVideoPlaying((p) => !p)}
            onMuteToggle={() => setVideoMuted((m) => !m)}
            onClose={closeVideo}
          />
          <InfoPanel
            open={infoOpen && !isVr}
            area={activeArea}
            onClose={() => setInfoOpen(false)}
            onSelectVideo={handleSelectVideo}
          />
        </div>
      </div>
    </section>
  );
}
