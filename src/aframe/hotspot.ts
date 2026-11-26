import type { TourLink } from "@/types/tour";
import { t } from "@/content/tour";
import { yawPitchToAFramePosition } from "@/lib/yawPitch";

const HOTSPOT_RADIUS = 7.5;

type AFrameEntityEl = HTMLElement & {
  destroy?: () => void;
  object3D?: unknown;
};

/** Clear A-Frame entities without tripping half-initialized geometry teardown. */
export function clearHotspotEntities(container: HTMLElement) {
  const children = Array.from(container.children) as AFrameEntityEl[];
  for (const child of children) {
    try {
      if (typeof child.destroy === "function") {
        child.destroy();
      } else {
        child.remove();
      }
    } catch {
      child.remove();
    }
  }
  container.replaceChildren();
}

export function buildHotspotEntities(
  container: HTMLElement,
  links: TourLink[],
  currentSceneId: string,
) {
  clearHotspotEntities(container);

  const visibleLinks = links.filter(
    (link) => link.targetSceneId !== currentSceneId,
  );

  for (const link of visibleLinks) {
    const entity = document.createElement("a-entity");
    const position = yawPitchToAFramePosition(
      link.yaw,
      link.pitch,
      HOTSPOT_RADIUS,
    );
    const label = t(link.label);

    // Set class before append so raycasters can see it once attached.
    entity.setAttribute("class", "tour-hotspot");
    entity.setAttribute("position", position);
    // Prefer primitive elements' attributes after mount — set via sphere primitive.
    entity.setAttribute(
      "geometry",
      "primitive: sphere; radius: 0.28; segmentsWidth: 16; segmentsHeight: 12",
    );
    entity.setAttribute(
      "material",
      "color: #e2b85c; opacity: 0.92; shader: flat",
    );
    entity.setAttribute("tour-hotspot", `targetSceneId: ${link.targetSceneId}`);
    entity.setAttribute("look-at", "#tour-camera");

    const text = document.createElement("a-text");
    text.setAttribute("value", label);
    text.setAttribute("align", "center");
    text.setAttribute("width", "4");
    text.setAttribute("color", "#f3eee4");
    text.setAttribute("position", "0 0.5 0");
    entity.appendChild(text);

    // Append first so the entity joins the scene graph, then components init safely.
    container.appendChild(entity);
  }
}
