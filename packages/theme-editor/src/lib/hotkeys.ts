import type { ResolvedOptions } from "./types";

const HOTKEYS = ["mod+z", "mod+shift+z", "t", "s", "e", "r", "g"];

let currentListeners: Array<() => void> = [];

export function initHotkeys({ origin }: Pick<ResolvedOptions, "origin">) {
  if (typeof window === "undefined") {
    return;
  }
  cleanupHotkeys();

  function handleKeyDown(event: KeyboardEvent) {
    if (isInputEvent(event)) {
      return;
    }
    const keyCombo = buildKeyCombo(event);

    if (HOTKEYS.includes(keyCombo)) {
      event.preventDefault();
      const message = {
        action: "hotkey",
        payload: { keys: keyCombo },
      };
      window.parent.postMessage(message, origin);
    }
  }
  window.addEventListener("keydown", handleKeyDown);

  currentListeners.push(() =>
    window.removeEventListener("keydown", handleKeyDown),
  );
}

export function cleanupHotkeys() {
  currentListeners.forEach((cleanup) => cleanup());
  currentListeners = [];
}

function buildKeyCombo(event: KeyboardEvent) {
  const parts: string[] = [];

  if (event.ctrlKey || event.metaKey) {
    parts.push("mod");
  }
  if (event.shiftKey) {
    parts.push("shift");
  }
  const key = event.key.toLowerCase();

  if (key !== "control" && key !== "meta" && key !== "shift") {
    parts.push(key);
  }
  return parts.join("+");
}

function isInputEvent(event: KeyboardEvent) {
  const element = event.target as HTMLElement;
  return element.matches("input, select, textarea, [contenteditable]");
}
