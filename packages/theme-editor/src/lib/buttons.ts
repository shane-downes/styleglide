import { createLogo } from "./logo";
import type { ResolvedOptions } from "./types";
import { isDesktop, setStyles } from "./utils";

export function createOpenButton(): HTMLButtonElement {
  const button = document.createElement("button");
  setStyles(button, style.base, style.hidden, style.open);

  setTimeout(() => {
    setStyles(button, style.visible);
  }, 2000);

  return button;
}

export function createCloseButton(
  resolvedMode: ResolvedOptions["resolvedMode"],
): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerHTML = "✕";
  setStyles(
    button,
    style.base,
    style.hidden,
    style[resolvedMode as keyof typeof style],
    isDesktop() ? style.closeDesktop : style.close,
  );

  return button;
}

export function updateOpenButton(
  button: HTMLButtonElement | null,
  resolvedMode: ResolvedOptions["resolvedMode"],
) {
  if (!button) return;
  setStyles(button, style[resolvedMode as keyof typeof style]);
  updateOpenButtonLogo(button, resolvedMode);
}

export function updateCloseButton(
  button: HTMLButtonElement | null,
  resolvedMode: ResolvedOptions["resolvedMode"],
) {
  if (!button) return;
  setStyles(button, style[resolvedMode as keyof typeof style]);
}

function updateOpenButtonLogo(
  button: HTMLButtonElement,
  resolvedMode: ResolvedOptions["resolvedMode"],
) {
  const logo = createLogo(resolvedMode);
  if (logo) {
    button.innerHTML = "";
    button.appendChild(logo);
  }
}

export function showOpenButton(button: HTMLButtonElement | null) {
  if (!button) return;
  setTimeout(() => {
    setStyles(button, style.visible, style.open);
  }, 400);
}

export function hideOpenButton(button: HTMLButtonElement | null) {
  if (!button) return;
  setStyles(button, style.hidden);
}

export function showCloseButton(button: HTMLButtonElement | null) {
  if (!button) return;
  setStyles(
    button,
    style.visible,
    isDesktop() ? style.closeDesktop : style.close,
  );
}

export function hideCloseButton(button: HTMLButtonElement | null) {
  if (!button) return;
  setStyles(button, style.hidden);
}

export function onClick(button: HTMLButtonElement, handler: () => void) {
  button.addEventListener("click", handler);
}

export function findCustomOpenButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>("[data-theme-editor-open]");
}

const style = {
  base: {
    position: "fixed",
    bottom: "1.825rem",
    left: "50%",
    padding: "0.5rem 0.875rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "1.5rem",
    cursor: "pointer",
    zIndex: "2147483647",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    userSelect: "none",
  },
  light: {
    backgroundColor: "#fff",
    borderColor: "#E4E4E7",
  },
  dark: {
    backgroundColor: "#17191A",
    borderColor: "#27272A",
  },
  hidden: {
    opacity: "0",
    pointerEvents: "none",
    transition: "auto",
  },
  visible: {
    opacity: "1",
    pointerEvents: "auto",
    transition: "opacity 0.3s ease",
  },
  open: {
    transform: "translateX(-50%)",
  },
  close: {
    transform: "translateX(-50%) translateY(-6.25rem)",
  },
  closeDesktop: {
    transform: "translateX(calc(-50% + 18rem))",
  },
} as const;
