import { themeEditor } from "./lib/theme-editor";

function getCurrentMode() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function detectColorFormat() {
  const styles = getComputedStyle(document.documentElement);

  const varsToCheck = [
    "--background",
    "--foreground",
    "--primary",
    "--secondary",
  ];

  for (const varName of varsToCheck) {
    const value = styles.getPropertyValue(varName).trim();
    // Channel format e.g. "0 0% 14.9%"
    if (value.match(/^[\d.]+%?[,\s]+[\d.]+%?[,\s]+[\d.]+%?$/)) {
      return "channels";
    }
  }
  return "colorSpace";
}

function createModeHandler() {
  return (mode: "light" | "dark") => {
    const html = document.documentElement;
    if (mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    if (localStorage.getItem("theme") !== null) {
      localStorage.setItem("theme", mode);
    }
  };
}

function createAutoWrapper() {
  if (typeof window === "undefined") {
    return;
  }

  const cssColorFormat = detectColorFormat();
  const onChangeMode = createModeHandler();

  function updateThemeEditor() {
    const resolvedMode = getCurrentMode();

    themeEditor({
      resolvedMode,
      cssColorFormat,
      onChangeMode,
      enabled: true,
    });
  }

  // Init
  updateThemeEditor();

  // Sync with external mode toggle
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        mutation.target === document.documentElement
      ) {
        updateThemeEditor();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "theme") {
      updateThemeEditor();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createAutoWrapper);
} else {
  createAutoWrapper();
}
