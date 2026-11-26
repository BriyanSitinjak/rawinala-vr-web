import type { TourLink } from "@/types/tour";
import { t } from "@/content/tour";
import { yawPitchToAFramePosition } from "@/lib/yawPitch";
import { clearAFrameChildren, el } from "@/aframe/dom";

const HOTSPOT_RADIUS = 7.5;

export function clearHotspotEntities(container: HTMLElement) {
  clearAFrameChildren(container);
}

export function buildHotspotEntities(
  container: HTMLElement,
  links: TourLink[],
  currentSceneId: string,
) {
  clearHotspotEntities(container);

  for (const link of links) {
    if (link.targetSceneId === currentSceneId) continue;

    const label = t(link.label);
    const entity = el("a-entity", {
      class: "tour-hotspot",
      position: yawPitchToAFramePosition(link.yaw, link.pitch, HOTSPOT_RADIUS),
      geometry:
        "primitive: sphere; radius: 0.28; segmentsWidth: 16; segmentsHeight: 12",
      material: "color: #e2b85c; opacity: 0.92; shader: flat",
      "tour-hotspot": `targetSceneId: ${link.targetSceneId}`,
      "look-at": "#tour-camera",
    });

    entity.appendChild(
      el("a-text", {
        value: label,
        align: "center",
        width: "4",
        color: "#f3eee4",
        position: "0 0.5 0",
      }),
    );

    container.appendChild(entity);
  }
}
