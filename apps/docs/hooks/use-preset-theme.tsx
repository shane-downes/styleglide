"use client";

import { useEffect, useState } from "react";
import { applyTheme, getCurrentThemeId } from "@/lib/apply-theme";
import { presetThemes } from "@/lib/preset-themes";
import { useMode } from "./use-mode";

export function usePresetTheme() {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    // Initialize from localStorage on mount
    return getCurrentThemeId();
  });
  const { mode } = useMode();

  // Apply theme whenever mode or themeId changes
  useEffect(() => {
    const theme = presetThemes.find((t) => t.id === currentThemeId);
    if (theme) {
      const resolvedMode = mode === "system" ? "light" : mode;
      applyTheme(theme, resolvedMode);
    }
  }, [mode, currentThemeId]);

  const setTheme = (themeId: string) => {
    const theme = presetThemes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentThemeId(themeId);
      // Theme will be applied by the effect above
    }
  };

  return {
    currentThemeId,
    setTheme,
    availableThemes: presetThemes,
  };
}

