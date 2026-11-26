import { positionToYawPitch } from "@/lib/yawPitch";
import { dispatchTourExitVideo, dispatchTourNavigate } from "@/lib/tourEvents";

type AFrameComponentSystem = {
  components: Record<string, unknown>;
  registerComponent: (name: string, definition: object) => void;
};

declare global {
  interface Window {
    AFRAME?: AFrameComponentSystem;
  }
}

type ClickableEl = HTMLElement & {
  addEventListener: (type: string, fn: (e: Event) => void) => void;
};

function register(name: string, definition: object) {
  const AFRAME = window.AFRAME;
  if (!AFRAME || AFRAME.components[name]) return;
  AFRAME.registerComponent(name, definition);
}

function bindClickAndTrigger(el: ClickableEl, handler: (event: Event) => void) {
  el.addEventListener("click", handler);
  el.addEventListener("triggerdown", handler);
}

export function registerTourComponents() {
  register("tour-hotspot", {
    schema: {
      targetSceneId: { type: "string" },
    },
    init(this: {
      data: { targetSceneId: string };
      el: ClickableEl & { setAttribute: (n: string, v: string) => void };
    }) {
      this.el.classList.add("tour-hotspot");
      this.el.setAttribute("data-target-scene", this.data.targetSceneId);

      bindClickAndTrigger(this.el, (event) => {
        event.stopPropagation();
        dispatchTourNavigate(this.data.targetSceneId);
      });
    },
  });

  register("tour-exit-video", {
    init(this: { el: ClickableEl }) {
      this.el.classList.add("tour-exit-video");
      bindClickAndTrigger(this.el, (event) => {
        event.stopPropagation();
        dispatchTourExitVideo();
      });
    },
  });

  register("tour-debug-click", {
    init(this: { el: ClickableEl }) {
      this.el.addEventListener("click", ((event: Event) => {
        const point = (
          event as CustomEvent<{
            intersection?: { point: { x: number; y: number; z: number } };
          }>
        ).detail?.intersection?.point;
        if (!point) return;
        const { yaw, pitch } = positionToYawPitch(point);
        // eslint-disable-next-line no-console
        console.log({
          yaw: Number(yaw.toFixed(2)),
          pitch: Number(pitch.toFixed(2)),
        });
      }) as EventListener);
    },
  });
}
