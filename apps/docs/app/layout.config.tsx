import { Logo } from "@workspace/ui/components/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <Logo className="h-6" />,
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
