import { defineConfig } from "tsup";

export default defineConfig([
  // Main builds
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    treeshake: true,
  },
  // Minified
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    minify: true,
    outDir: "dist",
    outExtension: () => ({ js: ".min.js" }),
  },
  // Minified, CDN auto wrapper
  {
    entry: ["src/auto.ts"],
    format: ["esm"],
    minify: true,
    outDir: "dist",
    outExtension: () => ({ js: ".min.js" }),
  },
]);
