"use client";

import { useEffect, useRef } from "react";
import type { TourLink } from "@/types/tour";
import { buildHotspotEntities } from "@/aframe/hotspot";
import { registerTourComponents } from "@/aframe/registerComponents";

export type AFrameSceneProps = {
  imageSrc: string;
  links: TourLink[];
  sceneId: string;
  debug?: boolean;
  onEnterVr?: () => void;
  onExitVr?: () => void;
  onUserInteract?: () => void;
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
  onEnterVr,
  onExitVr,
  onUserInteract,
}: AFrameSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneEl | null>(null);
  const skyRef = useRef<HTMLElement | null>(null);
  const hotspotsRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLElement | null>(null);
  const laserLeftRef = useRef<HTMLElement | null>(null);
  const laserRightRef = useRef<HTMLElement | null>(null);
  const readyRef = useRef(false);

  const propsRef = useRef({ imageSrc, links, sceneId, debug });
  propsRef.current = { imageSrc, links, sceneId, debug };

  const callbacksRef = useRef({ onEnterVr, onExitVr, onUserInteract });
  callbacksRef.current = { onEnterVr, onExitVr, onUserInteract };

  const applyScene = () => {
    if (!readyRef.current) return;
    const sky = skyRef.current;
    const hotspots = hotspotsRef.current;
    if (!sky || !hotspots) return;

    const { imageSrc: src, links: nextLinks, sceneId: nextId, debug: isDebug } =
      propsRef.current;

    sky.setAttribute("src", src);

    const raycasterObjects = isDebug
      ? ".tour-hotspot, .tour-debug-sky"
      : ".tour-hotspot";

    if (isDebug) {
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

    buildHotspotEntities(hotspots, nextLinks, nextId);
  };

  // Mount A-Frame once into a plain div — never let React reconcile a-* nodes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let sceneEl: SceneEl | null = null;

    const handleEnterVr = () => callbacksRef.current.onEnterVr?.();
    const handleExitVr = () => callbacksRef.current.onExitVr?.();
    const handleInteract = () => callbacksRef.current.onUserInteract?.();

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

      const sky = document.createElement("a-sky");
      sky.id = "tour-sky";
      sky.setAttribute("rotation", "0 -90 0");

      const hotspots = document.createElement("a-entity");
      hotspots.id = "tour-hotspots";

      const camera = document.createElement("a-entity");
      camera.id = "tour-camera";
      camera.setAttribute("camera", "");
      camera.setAttribute(
        "look-controls",
        "magicWindowTrackingEnabled: true; pointerLockEnabled: false",
      );
      camera.setAttribute("wasd-controls", "enabled: false");
      camera.setAttribute("position", "0 1.6 0");

      // a-cursor primitive avoids setting geometry before systems exist.
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

      scene.appendChild(sky);
      scene.appendChild(hotspots);
      scene.appendChild(camera);
      scene.appendChild(laserLeft);
      scene.appendChild(laserRight);
      root.appendChild(scene);

      sceneRef.current = scene;
      skyRef.current = sky;
      hotspotsRef.current = hotspots;
      cursorRef.current = cursor;
      laserLeftRef.current = laserLeft;
      laserRightRef.current = laserRight;
      sceneEl = scene;

      scene.addEventListener("enter-vr", handleEnterVr);
      scene.addEventListener("exit-vr", handleExitVr);
      scene.addEventListener("mousedown", handleInteract);
      scene.addEventListener("touchstart", handleInteract);

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
      // Leave teardown to React unmounting the root div; avoid manual
      // geometry.destroy during Strict Mode double-invoke races.
      if (root) {
        root.replaceChildren();
      }
      sceneRef.current = null;
      skyRef.current = null;
      hotspotsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React → A-Frame: update only when scene content changes.
  useEffect(() => {
    applyScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, links, sceneId, debug]);

  return (
    <div
      ref={rootRef}
      className="tour-aframe-root absolute inset-0 h-full w-full overflow-hidden bg-[var(--color-forest-deep)]"
    />
  );
}
