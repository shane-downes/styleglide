export type ThemeEditorOptions = {
  origin?: string;
  cssColorFormat?: "channels" | "colorSpace";
  onChangeMode?: (mode: "light" | "dark") => void;
  resolvedMode?: "light" | "dark" | string;
  enabled?: boolean;
};

export type ResolvedOptions = Required<ThemeEditorOptions>;
