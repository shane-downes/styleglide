# StyleGlide

[StyleGlide](https://styleglide.ai/) is an AI-powered theme editor for shadcn/ui apps that allows you to create your own Tailwind CSS design system.

The original [theme editor](https://styleglide.ai/themes) features preset apps from sources like [ui.shadcn.com](https://ui.shadcn.com/) and [shadcnblocks.com](https://www.shadcnblocks.com/template/mainline?via=styleglide) that you can select for real-time previews.

This repository introduces open-source tools to embed the theme editor into your own application.

## Packages

- **[@styleglide/theme-editor](./packages/theme-editor)**

## Apps

- **[docs.styleglide.ai](./apps/docs)**

## Quickstart

Add the theme editor to any shadcn/ui app via CDN:

```html
<script defer src="https://unpkg.com/@styleglide/theme-editor"></script>
```

### Manual Installation

For more control, install the package:

```bash
pnpm add @styleglide/theme-editor
```

See the [theme editor documentation](https://docs.styleglide.ai/theme-editor-package) for detailed setup instructions.

## Development

This is a monorepo managed with [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/).

### Setup

```bash
pnpm install
```

### Development

```bash
turbo dev
```

### Build

```bash
turbo build
```

### Linting

```bash
turbo lint
```
