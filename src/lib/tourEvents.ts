export const TOUR_NAVIGATE = "tour:navigate";
export const TOUR_EXIT_VIDEO = "tour:exit-video";

export type TourNavigateDetail = { sceneId: string };

export function dispatchTourNavigate(sceneId: string) {
  window.dispatchEvent(
    new CustomEvent<TourNavigateDetail>(TOUR_NAVIGATE, {
      detail: { sceneId },
    }),
  );
}

export function dispatchTourExitVideo() {
  window.dispatchEvent(new CustomEvent(TOUR_EXIT_VIDEO));
}

export function onTourNavigate(
  handler: (sceneId: string) => void,
): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<TourNavigateDetail>).detail;
    if (detail?.sceneId) handler(detail.sceneId);
  };
  window.addEventListener(TOUR_NAVIGATE, listener);
  return () => window.removeEventListener(TOUR_NAVIGATE, listener);
}

export function onTourExitVideo(handler: () => void): () => void {
  window.addEventListener(TOUR_EXIT_VIDEO, handler);
  return () => window.removeEventListener(TOUR_EXIT_VIDEO, handler);
}
