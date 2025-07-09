export function isDesktop() {
  return typeof window !== "undefined" && window.innerWidth >= 1024;
}

export function cleanupElement(element: Element | null) {
  if (element) {
    element.remove();
  }
  element = null;
}

export function setStyles(
  element: HTMLElement,
  ...styles: Array<Record<string, string>>
) {
  Object.assign(element.style, ...styles);
}
