"use client";

import { useEffect, useRef } from "react";
import type { TourLink } from "@/types/tour";
import { createTourScene, type TourSceneNodes } from "@/aframe/createScene";
import { setRaycasterObjects, setVisible } from "@/aframe/dom";
import { buildHotspotEntities, clearHotspotEntities } from "@/aframe/hotspot";
import { registerTourComponents } from "@/aframe/registerComponents";

export type AFrameSceneProps = {
  imageSrc: string;
  links: TourLink[];
  sceneId: string;
  debug?: boolean;
  videoSrc?: string | null;
  videoPlaying?: boolean;
  videoMuted?: boolean;
  onEnterVr?: () => void;
  onExitVr?: () => void;
  onUserInteract?: () => void;
  onVideoPlayingChange?: (playing: boolean) => void;
  onLoadingChange?: (loading: boolean) => void;
};

/**
 * React owns only the mount node. A-Frame owns the 3D DOM.
 */
export default function AFrameScene({
  imageSrc,
  links,
  sceneId,
  debug = false,
  videoSrc = null,
  videoPlaying = false,
  videoMuted = true,
  onEnterVr,
  onExitVr,
  onUserInteract,
  onVideoPlayingChange,
  onLoadingChange,
}: AFrameSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<TourSceneNodes | null>(null);
  const readyRef = useRef(false);
  const preloadTokenRef = useRef(0);

  const propsRef = useRef({
    imageSrc,
    links,
    sceneId,
    debug,
    videoSrc,
    videoPlaying,
    videoMuted,
  });
  propsRef.current = {
    imageSrc,
    links,
    sceneId,
    debug,
    videoSrc,
    videoPlaying,
    videoMuted,
  };

  const callbacksRef = useRef({
    onEnterVr,
    onExitVr,
    onUserInteract,
    onVideoPlayingChange,
    onLoadingChange,
  });
  callbacksRef.current = {
    onEnterVr,
    onExitVr,
    onUserInteract,
    onVideoPlayingChange,
    onLoadingChange,
  };

  const preloadPanorama = (src: string) => {
    const token = ++preloadTokenRef.current;
    callbacksRef.current.onLoadingChange?.(true);

    const finish = () => {
      if (token !== preloadTokenRef.current) return;
      nodesRef.current?.sky.setAttribute("src", src);
      callbacksRef.current.onLoadingChange?.(false);
    };

    const img = new window.Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = src;
  };

  const applyScene = () => {
    if (!readyRef.current || !nodesRef.current) return;
    const {
      sky,
      hotspots,
      videosphere,
      video,
      vrBack,
      cursor,
      laserLeft,
      laserRight,
    } = nodesRef.current;

    const {
      imageSrc: src,
      links: nextLinks,
      sceneId: nextId,
      debug: isDebug,
      videoSrc: nextVideo,
      videoPlaying: shouldPlay,
      videoMuted: muted,
    } = propsRef.current;

    const inVideo = Boolean(nextVideo);

    setVisible(sky, !inVideo);
    setVisible(videosphere, inVideo);
    setVisible(vrBack, inVideo);

    if (inVideo && nextVideo) {
      callbacksRef.current.onLoadingChange?.(false);
      if (video.getAttribute("src") !== nextVideo) {
        video.setAttribute("src", nextVideo);
        video.load();
      }
      video.muted = muted;
      video.playsInline = true;
      clearHotspotEntities(hotspots);

      if (shouldPlay) {
        void video.play().catch(() => {
          callbacksRef.current.onVideoPlayingChange?.(false);
        });
      } else {
        video.pause();
      }
    } else {
      video.pause();
      video.removeAttribute("src");
      video.load();
      preloadPanorama(src);
      buildHotspotEntities(hotspots, nextLinks, nextId);
    }

    const raycasterObjects = inVideo
      ? ".tour-exit-video"
      : isDebug
        ? ".tour-hotspot, .tour-debug-sky"
        : ".tour-hotspot";

    if (!inVideo && isDebug) {
      sky.setAttribute("tour-debug-click", "");
      sky.classList.add("tour-debug-sky");
    } else {
      sky.removeAttribute("tour-debug-click");
      sky.classList.remove("tour-debug-sky");
    }

    setRaycasterObjects([cursor, laserLeft, laserRight], raycasterObjects);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let nodes: TourSceneNodes | null = null;

    const handleEnterVr = () => callbacksRef.current.onEnterVr?.();
    const handleExitVr = () => callbacksRef.current.onExitVr?.();
    const handleInteract = () => callbacksRef.current.onUserInteract?.();
    const handlePlay = () => callbacksRef.current.onVideoPlayingChange?.(true);
    const handlePause = () => callbacksRef.current.onVideoPlayingChange?.(false);

    async function boot() {
      await import("aframe");
      if (cancelled || !root) return;

      registerTourComponents();
      root.replaceChildren();

      nodes = createTourScene();
      nodesRef.current = nodes;
      root.appendChild(nodes.scene);

      nodes.scene.addEventListener("enter-vr", handleEnterVr);
      nodes.scene.addEventListener("exit-vr", handleExitVr);
      nodes.scene.addEventListener("mousedown", handleInteract);
      nodes.scene.addEventListener("touchstart", handleInteract);
      nodes.video.addEventListener("play", handlePlay);
      nodes.video.addEventListener("pause", handlePause);

      const onLoaded = () => {
        if (cancelled) return;
        readyRef.current = true;
        applyScene();
      };

      if (nodes.scene.hasLoaded) {
        onLoaded();
      } else {
        nodes.scene.addEventListener("loaded", onLoaded, { once: true });
      }
    }

    void boot();

    return () => {
      cancelled = true;
      readyRef.current = false;
      if (nodes) {
        nodes.scene.removeEventListener("enter-vr", handleEnterVr);
        nodes.scene.removeEventListener("exit-vr", handleExitVr);
        nodes.scene.removeEventListener("mousedown", handleInteract);
        nodes.scene.removeEventListener("touchstart", handleInteract);
        nodes.video.removeEventListener("play", handlePlay);
        nodes.video.removeEventListener("pause", handlePause);
        nodes.video.pause();
      }
      root.replaceChildren();
      nodesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, links, sceneId, debug, videoSrc, videoPlaying, videoMuted]);

  return (
    <div
      ref={rootRef}
      className="tour-aframe-root absolute inset-0 h-full w-full overflow-hidden bg-[var(--color-forest-deep)]"
    />
  );
}
