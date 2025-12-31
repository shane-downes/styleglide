export type PresetTheme = {
  id: string;
  name: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

export type ThemeEditorOptions = {
  origin?: string;
  cssColorFormat?: "channels" | "colorSpace";
  onChangeMode?: (mode: "light" | "dark") => void;
  resolvedMode?: "light" | "dark" | string;
  enabled?: boolean;
  presets?: PresetTheme[];
};

export type ResolvedOptions = Required<
  Omit<ThemeEditorOptions, "presets">
> & {
  presets?: PresetTheme[];
};
