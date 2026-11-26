"use client";

import { useEffect, useRef } from "react";
import type { TourLink } from "@/types/tour";
import { buildHotspotEntities, clearHotspotEntities } from "@/aframe/hotspot";
import { registerTourComponents } from "@/aframe/registerComponents";
import { t, siteContent } from "@/content/tour";

export type AFrameSceneProps = {
  imageSrc: string;
  links: TourLink[];
  sceneId: string;
  debug?: boolean;
  /** When set, show videosphere instead of sky */
  videoSrc?: string | null;
  videoPlaying?: boolean;
  videoMuted?: boolean;
  onEnterVr?: () => void;
  onExitVr?: () => void;
  onUserInteract?: () => void;
  onVideoPlayingChange?: (playing: boolean) => void;
};

type SceneEl = HTMLElement & {
  hasLoaded?: boolean;
  addEventListener: HTMLElement["addEventListener"];
  removeEventListener: HTMLElement["removeEventListener"];
};

/**
 * React owns only the mount node. A-Frame owns the 3D DOM.
 * Creating a-* via React JSX fights A-Frame's custom elements (geometry crashes).
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
}: AFrameSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneEl | null>(null);
  const skyRef = useRef<HTMLElement | null>(null);
  const videosphereRef = useRef<HTMLElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const hotspotsRef = useRef<HTMLElement | null>(null);
  const vrBackRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLElement | null>(null);
  const laserLeftRef = useRef<HTMLElement | null>(null);
  const laserRightRef = useRef<HTMLElement | null>(null);
  const readyRef = useRef(false);

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
  });
  callbacksRef.current = {
    onEnterVr,
    onExitVr,
    onUserInteract,
    onVideoPlayingChange,
  };

  const applyScene = () => {
    if (!readyRef.current) return;
    const sky = skyRef.current;
    const hotspots = hotspotsRef.current;
    const videosphere = videosphereRef.current;
    const videoEl = videoElRef.current;
    const vrBack = vrBackRef.current;
    if (!sky || !hotspots || !videosphere || !videoEl || !vrBack) return;

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

    sky.setAttribute("src", src);
    sky.setAttribute("visible", inVideo ? "false" : "true");
    videosphere.setAttribute("visible", inVideo ? "true" : "false");
    vrBack.setAttribute("visible", inVideo ? "true" : "false");

    if (inVideo && nextVideo) {
      if (videoEl.getAttribute("src") !== nextVideo) {
        videoEl.setAttribute("src", nextVideo);
        videoEl.load();
      }
      videoEl.muted = muted;
      videoEl.playsInline = true;
      clearHotspotEntities(hotspots);

      if (shouldPlay) {
        void videoEl.play().catch(() => {
          callbacksRef.current.onVideoPlayingChange?.(false);
        });
      } else {
        videoEl.pause();
      }
    } else {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
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

    cursorRef.current?.setAttribute(
      "raycaster",
      `objects: ${raycasterObjects}; far: 50`,
    );
    laserLeftRef.current?.setAttribute(
      "raycaster",
      `objects: ${raycasterObjects}; far: 50`,
    );
    laserRightRef.current?.setAttribute(
      "raycaster",
      `objects: ${raycasterObjects}; far: 50`,
    );
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let sceneEl: SceneEl | null = null;
    let videoEl: HTMLVideoElement | null = null;

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

      const scene = document.createElement("a-scene") as SceneEl;
      scene.setAttribute("embedded", "true");
      scene.setAttribute("renderer", "colorManagement: true; antialias: true");
      scene.setAttribute("vr-mode-ui", "enabled: true");
      scene.setAttribute("device-orientation-permission-ui", "enabled: true");
      scene.setAttribute("loading-screen", "enabled: false");
      scene.setAttribute("background", "color: #1c3a30");
      scene.style.width = "100%";
      scene.style.height = "100%";

      const assets = document.createElement("a-assets");
      const video = document.createElement("video");
      video.id = "tour-video-el";
      video.setAttribute("crossorigin", "anonymous");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("preload", "none");
      video.playsInline = true;
      video.muted = true;
      video.loop = true;
      assets.appendChild(video);

      const sky = document.createElement("a-sky");
      sky.id = "tour-sky";
      sky.setAttribute("rotation", "0 -90 0");

      const videosphere = document.createElement("a-videosphere");
      videosphere.id = "tour-videosphere";
      videosphere.setAttribute("src", "#tour-video-el");
      videosphere.setAttribute("rotation", "0 -90 0");
      videosphere.setAttribute("visible", "false");

      const hotspots = document.createElement("a-entity");
      hotspots.id = "tour-hotspots";

      // Simple world-space back control for VR (also usable via gaze/laser).
      const vrBack = document.createElement("a-entity");
      vrBack.id = "tour-vr-back";
      vrBack.setAttribute("class", "tour-exit-video");
      vrBack.setAttribute("position", "0 1.4 -2.2");
      vrBack.setAttribute(
        "geometry",
        "primitive: plane; height: 0.35; width: 1.1",
      );
      vrBack.setAttribute(
        "material",
        "color: #e2b85c; opacity: 0.95; shader: flat; side: double",
      );
      vrBack.setAttribute("tour-exit-video", "");
      vrBack.setAttribute("visible", "false");
      const backLabel = document.createElement("a-text");
      backLabel.setAttribute("value", t(siteContent.tour.backFromVideoVr));
      backLabel.setAttribute("align", "center");
      backLabel.setAttribute("width", "3");
      backLabel.setAttribute("color", "#1a2b24");
      backLabel.setAttribute("position", "0 0 0.01");
      vrBack.appendChild(backLabel);

      const camera = document.createElement("a-entity");
      camera.id = "tour-camera";
      camera.setAttribute("camera", "");
      camera.setAttribute(
        "look-controls",
        "magicWindowTrackingEnabled: true; pointerLockEnabled: false",
      );
      camera.setAttribute("wasd-controls", "enabled: false");
      camera.setAttribute("position", "0 1.6 0");

      const cursor = document.createElement("a-cursor");
      cursor.setAttribute(
        "cursor",
        "fuse: true; fuseTimeout: 1200; rayOrigin: mouse",
      );
      cursor.setAttribute("color", "#f3eee4");
      cursor.setAttribute("opacity", "0.85");
      cursor.setAttribute("raycaster", "objects: .tour-hotspot; far: 50");
      camera.appendChild(cursor);

      const laserLeft = document.createElement("a-entity");
      laserLeft.setAttribute("laser-controls", "hand: left");
      laserLeft.setAttribute("raycaster", "objects: .tour-hotspot; far: 50");

      const laserRight = document.createElement("a-entity");
      laserRight.setAttribute("laser-controls", "hand: right");
      laserRight.setAttribute("raycaster", "objects: .tour-hotspot; far: 50");

      scene.appendChild(assets);
      scene.appendChild(sky);
      scene.appendChild(videosphere);
      scene.appendChild(hotspots);
      scene.appendChild(vrBack);
      scene.appendChild(camera);
      scene.appendChild(laserLeft);
      scene.appendChild(laserRight);
      root.appendChild(scene);

      sceneRef.current = scene;
      skyRef.current = sky;
      videosphereRef.current = videosphere;
      videoElRef.current = video;
      hotspotsRef.current = hotspots;
      vrBackRef.current = vrBack;
      cursorRef.current = cursor;
      laserLeftRef.current = laserLeft;
      laserRightRef.current = laserRight;
      sceneEl = scene;
      videoEl = video;

      scene.addEventListener("enter-vr", handleEnterVr);
      scene.addEventListener("exit-vr", handleExitVr);
      scene.addEventListener("mousedown", handleInteract);
      scene.addEventListener("touchstart", handleInteract);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      const onLoaded = () => {
        if (cancelled) return;
        readyRef.current = true;
        applyScene();
      };

      if (scene.hasLoaded) {
        onLoaded();
      } else {
        scene.addEventListener("loaded", onLoaded, { once: true });
      }
    }

    void boot();

    return () => {
      cancelled = true;
      readyRef.current = false;
      if (sceneEl) {
        sceneEl.removeEventListener("enter-vr", handleEnterVr);
        sceneEl.removeEventListener("exit-vr", handleExitVr);
        sceneEl.removeEventListener("mousedown", handleInteract);
        sceneEl.removeEventListener("touchstart", handleInteract);
      }
      if (videoEl) {
        videoEl.removeEventListener("play", handlePlay);
        videoEl.removeEventListener("pause", handlePause);
        videoEl.pause();
      }
      if (root) {
        root.replaceChildren();
      }
      sceneRef.current = null;
      skyRef.current = null;
      videosphereRef.current = null;
      videoElRef.current = null;
      hotspotsRef.current = null;
      vrBackRef.current = null;
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
