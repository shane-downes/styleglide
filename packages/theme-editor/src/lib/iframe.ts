import {
  createCloseButton,
  createOpenButton,
  findCustomOpenButton,
  hideCloseButton,
  hideOpenButton,
  onClick,
  showCloseButton,
  showOpenButton,
  updateCloseButton,
  updateOpenButton,
} from "./buttons";
import type { ResolvedOptions } from "./types";
import { cleanupElement, isDesktop, setStyles } from "./utils";

let currentIframe: HTMLIFrameElement | null = null;
let currentCloseButton: HTMLButtonElement | null = null;
let currentOpenButton: HTMLButtonElement | null = null;
let currentResizeListener: (() => void) | null = null;
let initialOverflow: string | null = null;
let isCustomOpenButton = false;
let open = false;

export function initIframe({
  origin,
  cssColorFormat,
  resolvedMode,
}: Pick<ResolvedOptions, "origin" | "cssColorFormat" | "resolvedMode">) {
  const isClient = typeof window !== "undefined";
  const isEmbedded = isClient && window.location.search.includes("_embedded=1");

  if (!isClient || isEmbedded) {
    return;
  }
  cleanupIframe();

  const iframe = document.createElement("iframe");

  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("_embedded", "1");

  const iframeUrl = new URL(`${origin}/themes`);
  iframeUrl.searchParams.set("url", currentUrl.toString());
  iframeUrl.searchParams.set("format", cssColorFormat);

  iframe.src = iframeUrl.toString();
  iframe.allow = "clipboard-write";

  iframe.addEventListener("load", () =>
    sendInitialMode(iframe, origin, resolvedMode),
  );
  setStyles(iframe, style.base, style.closed);
  document.body.appendChild(iframe);

  const customOpenButton = findCustomOpenButton();
  isCustomOpenButton = !!customOpenButton;

  const openButton = customOpenButton || createOpenButton();
  onClick(openButton, () => openIframe(origin));

  if (!isCustomOpenButton) {
    updateOpenButton(openButton, resolvedMode);
    document.body.appendChild(openButton);
  }

  const closeButton = createCloseButton(resolvedMode);
  onClick(closeButton, () => closeIframe(origin));
  document.body.appendChild(closeButton);

  currentIframe = iframe;
  currentOpenButton = openButton;
  currentCloseButton = closeButton;

  hideCloseButton(closeButton);

  initResizeListener();
}

export function updateIframe({
  resolvedMode,
}: Pick<ResolvedOptions, "resolvedMode">) {
  if (!isCustomOpenButton) {
    updateOpenButton(currentOpenButton, resolvedMode);
  }
  updateCloseButton(currentCloseButton, resolvedMode);
}

export function cleanupIframe() {
  cleanupElement(currentIframe);
  cleanupElement(currentCloseButton);
  cleanupResizeListener();
  restoreOverflow();
  if (!isCustomOpenButton) {
    cleanupElement(currentOpenButton);
  }
  isCustomOpenButton = false;
  open = false;
}

function openIframe(origin: ResolvedOptions["origin"]) {
  if (!currentIframe) return;
  initialOverflow = document.body.style.overflow || null;
  setStyles(currentIframe, style.open);
  setStyles(document.body, { overflow: "hidden" });

  showCloseButton(currentCloseButton);
  hideOpenButton(currentOpenButton);

  postMessage(currentIframe, origin, {
    action: "iframeEditorOpened",
  });

  open = true;
}

function closeIframe(origin: ResolvedOptions["origin"]) {
  if (!currentIframe) return;

  postMessage(currentIframe, origin, {
    action: "iframeEditorClosed",
  });

  if (!isCustomOpenButton) {
    showOpenButton(currentOpenButton);
  }
  hideCloseButton(currentCloseButton);

  open = false;

  const timeout = isDesktop() ? 350 : 0;

  setTimeout(() => {
    if (!currentIframe) return;
    setStyles(currentIframe, style.closed);
    restoreOverflow();
  }, timeout);
}

function sendInitialMode(
  iframe: HTMLIFrameElement,
  origin: ResolvedOptions["origin"],
  resolvedMode: ResolvedOptions["resolvedMode"],
) {
  const message = {
    action: "modeToggled",
    payload: resolvedMode,
  };
  setTimeout(() => postMessage(iframe, origin, message), 100);
}

function postMessage(
  iframe: HTMLIFrameElement,
  origin: ResolvedOptions["origin"],
  message: { action: string; payload?: unknown },
) {
  iframe.contentWindow?.postMessage(message, origin);
}

function initResizeListener() {
  currentResizeListener = () => {
    if (open) {
      showCloseButton(currentCloseButton);
    }
  };
  window.addEventListener("resize", currentResizeListener);
}

function cleanupResizeListener() {
  if (!currentResizeListener) return;
  window.removeEventListener("resize", currentResizeListener);
  currentResizeListener = null;
}

function restoreOverflow() {
  if (initialOverflow) {
    setStyles(document.body, { overflow: initialOverflow });
  } else {
    document.body.style.removeProperty("overflow");
  }
}

const style = {
  base: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    border: "none",
  },
  closed: {
    zIndex: "-1",
    opacity: "0",
    pointerEvents: "none",
  },
  open: {
    zIndex: "2147483646",
    opacity: "1",
    pointerEvents: "auto",
  },
} as const;
