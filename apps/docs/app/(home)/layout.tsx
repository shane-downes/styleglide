import { baseOptions } from "@/app/layout.config";
import { AppHeader } from "@/components/app-header";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <DocsLayout
        sidebar={{ collapsible: false }}
        tree={source.pageTree}
        {...baseOptions}
      >
        {children}
      </DocsLayout>
    </>
  );
}
