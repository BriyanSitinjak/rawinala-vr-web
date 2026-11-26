import { el } from "@/aframe/dom";
import { siteContent, t } from "@/content/tour";

export type TourSceneNodes = {
  scene: HTMLElement & { hasLoaded?: boolean };
  sky: HTMLElement;
  videosphere: HTMLElement;
  video: HTMLVideoElement;
  hotspots: HTMLElement;
  vrBack: HTMLElement;
  cursor: HTMLElement;
  laserLeft: HTMLElement;
  laserRight: HTMLElement;
};

/** Build the tour a-scene tree once; React never reconciles these nodes. */
export function createTourScene(): TourSceneNodes {
  const scene = el("a-scene", {
    embedded: "true",
    renderer: "colorManagement: true; antialias: true",
    "vr-mode-ui": "enabled: true",
    "device-orientation-permission-ui": "enabled: true",
    "loading-screen": "enabled: false",
    background: "color: #1c3a30",
  }) as TourSceneNodes["scene"];
  scene.style.width = "100%";
  scene.style.height = "100%";

  const assets = el("a-assets");
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

  const sky = el("a-sky", {
    id: "tour-sky",
    rotation: "0 -90 0",
  });

  const videosphere = el("a-videosphere", {
    id: "tour-videosphere",
    src: "#tour-video-el",
    rotation: "0 -90 0",
    visible: "false",
  });

  const hotspots = el("a-entity", { id: "tour-hotspots" });

  const vrBack = el("a-entity", {
    id: "tour-vr-back",
    class: "tour-exit-video",
    position: "0 1.4 -2.2",
    geometry: "primitive: plane; height: 0.35; width: 1.1",
    material: "color: #e2b85c; opacity: 0.95; shader: flat; side: double",
    "tour-exit-video": "",
    visible: "false",
  });
  vrBack.appendChild(
    el("a-text", {
      value: t(siteContent.tour.backFromVideoVr),
      align: "center",
      width: "3",
      color: "#1a2b24",
      position: "0 0 0.01",
    }),
  );

  const camera = el("a-entity", {
    id: "tour-camera",
    camera: "",
    "look-controls":
      "magicWindowTrackingEnabled: true; pointerLockEnabled: false",
    "wasd-controls": "enabled: false",
    position: "0 1.6 0",
  });

  const cursor = el("a-cursor", {
    cursor: "fuse: true; fuseTimeout: 1200; rayOrigin: mouse",
    color: "#f3eee4",
    opacity: "0.85",
    raycaster: "objects: .tour-hotspot; far: 50",
  });
  camera.appendChild(cursor);

  const laserLeft = el("a-entity", {
    "laser-controls": "hand: left",
    raycaster: "objects: .tour-hotspot; far: 50",
  });
  const laserRight = el("a-entity", {
    "laser-controls": "hand: right",
    raycaster: "objects: .tour-hotspot; far: 50",
  });

  scene.append(assets, sky, videosphere, hotspots, vrBack, camera, laserLeft, laserRight);

  return {
    scene,
    sky,
    videosphere,
    video,
    hotspots,
    vrBack,
    cursor,
    laserLeft,
    laserRight,
  };
}
