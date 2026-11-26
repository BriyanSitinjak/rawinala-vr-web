import { dispatchTourNavigate } from "@/lib/tourEvents";
import { scrollToId } from "@/lib/scroll";

/** Read the active tour scene from the URL (no router remount). */
export function readTourSceneId(search = window.location.search): string | null {
  return new URLSearchParams(search).get("scene");
}

/** Sync scene to the URL without remounting / exiting VR. */
export function syncTourUrl(sceneId: string, areaId?: string | null) {
  const url = new URL(window.location.href);
  url.searchParams.set("scene", sceneId);
  if (areaId) {
    url.searchParams.set("area", areaId);
  } else {
    url.searchParams.delete("area");
  }
  window.history.replaceState(null, "", url);
}

/** Bookmark a scene, scroll to the tour, and notify listeners. */
export function openTourScene(sceneId: string, areaId?: string | null) {
  syncTourUrl(sceneId, areaId);
  scrollToId("tour");
  dispatchTourNavigate(sceneId);
}
