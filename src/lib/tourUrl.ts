export function readTourParams(search = window.location.search): {
  sceneId: string | null;
  areaId: string | null;
} {
  const params = new URLSearchParams(search);
  return {
    sceneId: params.get("scene"),
    areaId: params.get("area"),
  };
}

/** Sync scene to the URL without remounting React Router / exiting VR. */
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
