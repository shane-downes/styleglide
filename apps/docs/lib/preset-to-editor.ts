import type { PresetTheme as EditorPresetTheme } from "@styleglide/theme-editor";
import type { PresetTheme } from "./preset-themes";

/**
 * Converts our internal preset format to the theme editor's preset format
 */
export function convertPresetForEditor(
  preset: PresetTheme,
): EditorPresetTheme {
  const lightColors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  // Convert base colors
  Object.entries(preset.colors.light.base).forEach(([key, value]) => {
    lightColors[`--base-${key}`] = value;
  });
  Object.entries(preset.colors.dark.base).forEach(([key, value]) => {
    darkColors[`--base-${key}`] = value;
  });

  // Convert primary colors
  Object.entries(preset.colors.light.primary).forEach(([key, value]) => {
    lightColors[`--primary-${key}`] = value;
  });
  Object.entries(preset.colors.dark.primary).forEach(([key, value]) => {
    darkColors[`--primary-${key}`] = value;
  });

  return {
    id: preset.id,
    name: preset.name,
    colors: {
      light: lightColors,
      dark: darkColors,
    },
  };
}

/**
 * Converts all presets to editor format
 */
export function convertPresetsForEditor(
  presets: PresetTheme[],
): EditorPresetTheme[] {
  return presets.map(convertPresetForEditor);
}

