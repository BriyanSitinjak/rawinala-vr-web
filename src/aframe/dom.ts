/** Tiny helpers for imperative A-Frame DOM (avoid React reconciling a-*). */

export function el(tag: string, attrs: Record<string, string> = {}): HTMLElement {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

export function setVisible(node: HTMLElement | null, visible: boolean) {
  node?.setAttribute("visible", visible ? "true" : "false");
}

export function setRaycasterObjects(
  nodes: Array<HTMLElement | null>,
  objects: string,
) {
  const value = `objects: ${objects}; far: 50`;
  for (const node of nodes) {
    node?.setAttribute("raycaster", value);
  }
}

export type AFrameEntityEl = HTMLElement & {
  destroy?: () => void;
};

export function clearAFrameChildren(container: HTMLElement) {
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
