import { Logo } from "@workspace/ui/components/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const appUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || "https://styleglide.ai";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    // Avoid auto target _blank on external href
    title: false,
    children: (
      <a href={appUrl}>
        <Logo className="h-6 md:hidden" />
      </a>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
