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

const warnedOptions = new Set<keyof ThemeEditorOptions>();

export function themeEditor(options: ThemeEditorOptions = {}) {
  const props = setProps(options);

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

function setProps(options: ThemeEditorOptions = {}) {
  const validatedOptions = validateOptions(options);
  return { ...defaultOptions, ...validatedOptions };
}

function validateOptions(options: ThemeEditorOptions) {
  const validatedOptions: ThemeEditorOptions = {};

  for (const [key, value] of Object.entries(options)) {
    switch (key) {
      case "origin":
        if (typeof value === "string") {
          try {
            new URL(value);
            validatedOptions.origin = value;
          } catch {
            warnInvalidOption({
              key,
              expected: "valid string URL",
              received: value,
            });
          }
        } else {
          warnInvalidOption({
            key,
            expected: "valid string URL",
            received: value,
          });
        }
        break;
      case "cssColorFormat":
        if (value === "channels" || value === "colorSpace") {
          validatedOptions.cssColorFormat = value;
        } else {
          warnInvalidOption({
            key,
            expected: "'channels' or 'colorSpace'",
            received: value,
          });
        }
        break;
      case "onChangeMode":
        if (typeof value === "function") {
          validatedOptions.onChangeMode = value;
        } else {
          warnInvalidOption({ key, expected: "function", received: value });
        }
        break;
      case "resolvedMode":
        if (value === "light" || value === "dark") {
          validatedOptions.resolvedMode = value;
        } else {
          warnInvalidOption({
            key,
            expected: "'light' or 'dark'",
            received: value,
          });
        }
        break;
      case "enabled":
        if (typeof value === "boolean") {
          validatedOptions.enabled = value;
        } else {
          warnInvalidOption({ key, expected: "boolean", received: value });
        }
        break;
      default:
        console.warn(
          `[@styleglide/theme-editor]: Unknown option '${key}' provided. Ignoring.`,
        );
    }
  }

  return validatedOptions;
}

function warnInvalidOption({
  key,
  expected,
  received,
}: {
  key: keyof ThemeEditorOptions;
  expected: string;
  received: unknown;
}) {
  const isClient = typeof window !== "undefined";
  const isEmbedded = isClient && window.location.search.includes("_embedded=1");

  if (isEmbedded) {
    return;
  }

  if (!warnedOptions.has(key)) {
    warnedOptions.add(key);
    console.warn(
      `[@styleglide/theme-editor]: Invalid option '${key}': expected ${expected}, got ${typeof received === "string" ? `'${received}'` : typeof received}. Reverting to default.`,
    );
  }
}
