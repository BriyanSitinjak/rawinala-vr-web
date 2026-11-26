import { positionToYawPitch } from "@/lib/yawPitch";

type AFrameComponentSystem = {
  components: Record<string, unknown>;
  registerComponent: (name: string, definition: object) => void;
};

declare global {
  interface Window {
    AFRAME?: AFrameComponentSystem;
  }
}

function register(name: string, definition: object) {
  const AFRAME = window.AFRAME;
  if (!AFRAME) return;
  if (AFRAME.components[name]) return;
  AFRAME.registerComponent(name, definition);
}

export function registerTourComponents() {
  register("tour-hotspot", {
    schema: {
      targetSceneId: { type: "string" },
    },
    init(this: {
      data: { targetSceneId: string };
      el: HTMLElement & {
        addEventListener: (type: string, fn: (e: Event) => void) => void;
        setAttribute: (name: string, value: string) => void;
      };
    }) {
      this.el.classList.add("tour-hotspot");
      this.el.setAttribute("data-target-scene", this.data.targetSceneId);

      const onClick = (event: Event) => {
        event.stopPropagation();
        const detail = { sceneId: this.data.targetSceneId };
        this.el.dispatchEvent(
          new CustomEvent("tour:navigate", {
            detail,
            bubbles: true,
            composed: true,
          }),
        );
        window.dispatchEvent(
          new CustomEvent("tour:navigate", { detail }),
        );
      };

      this.el.addEventListener("click", onClick);
      this.el.addEventListener("triggerdown", onClick);
    },
  });

  register("tour-exit-video", {
    init(this: {
      el: HTMLElement & {
        addEventListener: (type: string, fn: (e: Event) => void) => void;
      };
    }) {
      this.el.classList.add("tour-exit-video");
      const onClick = (event: Event) => {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent("tour:exit-video"));
      };
      this.el.addEventListener("click", onClick);
      this.el.addEventListener("triggerdown", onClick);
    },
  });

  register("tour-debug-click", {
    init(this: {
      el: HTMLElement & {
        addEventListener: (
          type: string,
          fn: (e: CustomEvent & { detail?: { intersection?: { point: { x: number; y: number; z: number } } } }) => void,
        ) => void;
        sceneEl?: HTMLElement & {
          addEventListener: (type: string, fn: (e: Event) => void) => void;
        };
      };
    }) {
      const handler = (event: {
        detail?: { intersection?: { point: { x: number; y: number; z: number } } };
      }) => {
        const point = event.detail?.intersection?.point;
        if (!point) return;
        const { yaw, pitch } = positionToYawPitch(point);
        // eslint-disable-next-line no-console
        console.log({
          yaw: Number(yaw.toFixed(2)),
          pitch: Number(pitch.toFixed(2)),
        });
      };

      this.el.addEventListener("click", handler as never);
    },
  });
}
