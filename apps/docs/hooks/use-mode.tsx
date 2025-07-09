import { useTheme } from "next-themes";

export const useMode = () => {
  const { resolvedTheme, setTheme: setMode } = useTheme();

  const isDark = resolvedTheme === "dark";
  const toggleMode = () => setMode(isDark ? "light" : "dark");

  return {
    mode: resolvedTheme,
    setMode,
    isDark: resolvedTheme === "dark",
    toggleMode,
  } as const;
};
