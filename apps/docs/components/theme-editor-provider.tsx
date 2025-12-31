"use client";

import { useEffect } from "react";
import { themeEditor } from "@styleglide/theme-editor";
import { useMode } from "@/hooks/use-mode";
import { presetThemes } from "@/lib/preset-themes";
import { convertPresetsForEditor } from "@/lib/preset-to-editor";

export function ThemeEditorProvider() {
  const { mode } = useMode();

  useEffect(() => {
    const resolvedMode = mode === "system" ? "light" : (mode as "light" | "dark");
    
    themeEditor({
      enabled: process.env.NODE_ENV === "development",
      resolvedMode,
      presets: convertPresetsForEditor(presetThemes),
      cssColorFormat: "colorSpace",
    });
  }, [mode]);

  return null;
}

