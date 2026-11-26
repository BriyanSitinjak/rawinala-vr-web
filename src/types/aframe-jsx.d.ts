import type { CSSProperties, ReactNode, Ref } from "react";

type AFrameProps = {
  children?: ReactNode;
  className?: string;
  class?: string;
  id?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement | null>;
  geometry?: string;
  material?: string;
  position?: string;
  rotation?: string;
  scale?: string;
  visible?: string | boolean;
  src?: string;
  camera?: boolean | string;
  embedded?: boolean | string;
  renderer?: string;
  background?: string;
  text?: string;
  value?: string;
  align?: string;
  width?: string | number;
  color?: string;
  cursor?: string;
  raycaster?: string;
  "look-controls"?: string;
  "wasd-controls"?: string;
  "laser-controls"?: string;
  "look-at"?: string;
  "device-orientation-permission-ui"?: string;
  "vr-mode-ui"?: string;
  "loading-screen"?: string;
  "tour-hotspot"?: string;
  "tour-debug-click"?: string | boolean;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": AFrameProps;
      "a-assets": AFrameProps;
      "a-asset-item": AFrameProps;
      "a-sky": AFrameProps;
      "a-videosphere": AFrameProps;
      "a-entity": AFrameProps;
      "a-camera": AFrameProps;
      "a-cursor": AFrameProps;
      "a-text": AFrameProps;
      "a-ring": AFrameProps;
      "a-sphere": AFrameProps;
      "a-plane": AFrameProps;
    }
  }
}

export {};
