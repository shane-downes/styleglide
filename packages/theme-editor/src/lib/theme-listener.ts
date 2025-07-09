import type { ResolvedOptions, ThemeEditorOptions } from "./types";

let currentStylesheet: HTMLStyleElement | null = null;
let currentResolvedMode: ThemeEditorOptions["resolvedMode"] | null = null;
let currentOnChangeMode: ThemeEditorOptions["onChangeMode"] | null = null;
let currentMessageListener: ((event: MessageEvent) => void) | null = null;

export function initThemeListener({
  origin,
  resolvedMode,
  onChangeMode,
}: Pick<ResolvedOptions, "origin" | "resolvedMode" | "onChangeMode">) {
  if (typeof window === "undefined") {
    return () => {};
  }
  currentResolvedMode = resolvedMode;
  currentOnChangeMode = onChangeMode;

  cleanupThemeListener();

  const themeListener = (event: MessageEvent) => {
    if (event.origin !== origin) {
      return;
    }

    if (event.data.action === "styleKitUpdated") {
      const { css, displayFontUrl, textFontUrl, mode } =
        event.data?.payload || {};

      loadThemeCss(css);
      loadFontLink(displayFontUrl);
      loadFontLink(textFontUrl);
      handleFontStyles();

      if (mode !== currentResolvedMode && currentOnChangeMode) {
        currentOnChangeMode(mode);
        const root = document.documentElement;
        root.style.colorScheme = mode;
      }
    }
  };
  currentMessageListener = themeListener;

  window.addEventListener("message", themeListener);
}

export function updateThemeListener({
  resolvedMode,
  onChangeMode,
}: Pick<ResolvedOptions, "resolvedMode" | "onChangeMode">) {
  currentResolvedMode = resolvedMode;
  currentOnChangeMode = onChangeMode;
}

export function cleanupThemeListener() {
  if (!currentMessageListener) return;
  window.removeEventListener("message", currentMessageListener);
  currentMessageListener = null;
}

function loadFontLink(url: string) {
  if (!url || isFontLinkLoaded(url)) return;
  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

function isFontLinkLoaded(url: string) {
  return Array.from(document.head.getElementsByTagName("link")).some(
    (link) => link.href === url
  );
}

function loadThemeCss(css: string) {
  if (!css) return;
  if (!currentStylesheet) {
    currentStylesheet = document.createElement("style");
    currentStylesheet.id = "styleglide-theme";
    document.head.appendChild(currentStylesheet);
  }
  currentStylesheet.textContent = css;
}

function hasClassNames(classNames: string) {
  return document.getElementsByClassName(classNames).length > 0;
}

function handleFontStyles() {
  if (!hasClassNames("font-text")) {
    const body = document.body;
    body.style.setProperty("font-family", "var(--text-family)", "important");
    body.style.setProperty("font-weight", "var(--text-weight)", "important");
  }
  if (!hasClassNames("font-display")) {
    const headings = document.querySelectorAll<HTMLHeadingElement>(
      "h1, h2, h3, h4, h5, h6"
    );
    headings.forEach((heading) => {
      heading.style.setProperty(
        "font-family",
        "var(--display-family)",
        "important"
      );
      heading.style.setProperty(
        "font-weight",
        "var(--display-weight)",
        "important"
      );
    });
  }
}
