import { defaultOptions } from "./default-options";
import { cleanupHotkeys, initHotkeys } from "./hotkeys";
import { cleanupIframe, initIframe, updateIframe } from "./iframe";
import {
  cleanupThemeListener,
  initThemeListener,
  updateThemeListener,
} from "./theme-listener";
import type { ResolvedOptions, ThemeEditorOptions } from "./types";

let prevProps: ResolvedOptions | null = null;
let isInitialized = false;

export function themeEditor(options: ThemeEditorOptions = {}) {
  const props = { ...defaultOptions, ...options } satisfies ResolvedOptions;

  const { enabled } = props;

  if (!enabled && prevProps?.enabled && isInitialized) {
    cleanupAll();
    isInitialized = false;
  }
  if (!enabled) {
    return save(props);
  }
  if (!prevProps || !isInitialized) {
    initAll(props);
    isInitialized = true;
    return save(props);
  }

  function updated(...keys: (keyof ResolvedOptions)[]) {
    return keys.some((key) => prevProps?.[key] !== props[key]);
  }

  if (updated("origin")) {
    initAll(props);
    return save(props);
  }
  if (updated("resolvedMode", "onChangeMode")) {
    updateThemeListener(props);
  }
  if (updated("resolvedMode")) {
    updateIframe(props);
  }
  if (updated("cssColorFormat")) {
    cleanupIframe();
    initIframe(props);
  }
  return save(props);
}

function initAll(props: ResolvedOptions) {
  initHotkeys(props);
  initIframe(props);
  initThemeListener(props);
}

function cleanupAll() {
  cleanupHotkeys();
  cleanupIframe();
  cleanupThemeListener();
}

function save(props: ResolvedOptions) {
  prevProps = props;
}
