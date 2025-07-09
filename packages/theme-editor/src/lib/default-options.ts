import { STYLEGLIDE_ORIGIN } from "./origin";
import type { ResolvedOptions } from "./types";

export const defaultOptions: ResolvedOptions = {
  origin: STYLEGLIDE_ORIGIN,
  cssColorFormat: "colorSpace",
  onChangeMode: () => {},
  resolvedMode: "light",
  enabled: true,
};
