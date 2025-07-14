# @styleglide/theme-editor

You can load the StyleGlide theme editor into any app that uses the shadcn/ui design system with this lightweight, zero-dependency JS package.

## Quickstart

Initialize the theme editor via CDN.

```html
<script defer src="https://unpkg.com/@styleglide/theme-editor"></script>
```

**This line of code is all you need to start using the theme editor.**

- A button that activates it will appear in the bottom center of your screen
- StyleGlide generates Tailwind CSS palettes and shadcn/ui themes on demand
- Your application updates with a real-time preview
- You can copy the current theme or install it with the shadcn CLI

**What the CDN install handles automatically:**

- Checks `dark` class on `<html>` and `theme` in `localStorage` for mode toggle integration
- Detects CSS `channels` vs `colorSpace` format in CSS theme vars

### Next.js

Add the CDN link to a `next/script` tag in your `app/layout.tsx`

```jsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Script src="https://unpkg.com/@styleglide/theme-editor" />
        {children}
      </body>
    </html>
  );
}
```

## Manual Setup

For more control over how the theme editor is initialized, you can install the package via NPM.

For this example we'll use the Next.js App Router, but the basics remain the same for any React app.

> Note: React is not required to run the theme editor. In fact, you can even use it with shadcn/ui ports that use more traditional web stacks such as [basecoat](https://basecoatui.com/).

### 1. Install the package

```bash
pnpm add @styleglide/theme-editor
```

```bash
npm install @styleglide/theme-editor
```

```bash
yarn add @styleglide/theme-editor
```

```bash
bun add @styleglide/theme-editor
```

### 2. Create a theme editor component:

```tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { themeEditor } from "@styleglide/theme-editor";

export function ThemeEditor() {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    themeEditor({
      enabled: process.env.NODE_ENV === "development",
      onChangeMode: setTheme,
      resolvedMode: resolvedTheme,
    });
  }, [resolvedTheme, setTheme]);

  return null;
}
```

### 3. Add it to your root layout as a child of your theme provider:

```tsx
import { ReactNode } from "react";
import { ThemeEditor } from "@/components/theme-editor";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeEditor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### CSS Color Format

The default `cssColorFormat` is `colorSpace` and works for Tailwind v4 CSS vars like `hsl(0 0% 45.1%)`.

For Tailwind v3 vars like `0 0% 45.1%`, use the `"channels"` format:

```tsx
themeEditor({
  // ...
  cssColorFormat: "channels",
});
```

### Custom Open Button

By default, the theme editor creates a floating StyleGlide button to open the editor. You can use your own custom button instead by adding the `data-theme-editor-open` attribute:

```html
<button data-theme-editor-open>Open Theme Editor</button>
```

## API Reference

### `themeEditor`

The main function to initialize the theme editor.

```typescript
themeEditor(options: ThemeEditorOptions): void
```

### `type ThemeEditorOptions`

An object containing the configuration for the theme editor.

| Property         | Type                                | Default        |
| ---------------- | ----------------------------------- | -------------- |
| `resolvedMode`   | `'light' \| 'dark'`                 | `'light'`      |
| `onChangeMode`   | `(mode: 'light' \| 'dark') => void` | -              |
| `enabled`        | `boolean`                           | `true`         |
| `cssColorFormat` | `'channels' \| 'colorSpace'`        | `'colorSpace'` |
