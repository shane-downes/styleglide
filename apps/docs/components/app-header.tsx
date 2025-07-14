"use client";

import { useMode } from "@/hooks/use-mode";
import { config } from "@/utils/config";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Logo } from "@workspace/ui/components/logo";
import { cn } from "@workspace/ui/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useId } from "react";

const appUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || "https://styleglide.ai";

const nav = [
  {
    label: "Docs",
    url: "/",
    current: true,
  },
  {
    label: "GitHub",
    url: config.urls.github,
    target: "_blank",
  },
  {
    label: "Feedback",
    url: config.urls.feedback,
    target: "_blank",
  },
  { label: "Theme Editor", url: `${appUrl}/themes` },
];

export function AppHeader(
  props: Omit<React.ComponentProps<typeof Header>, "children">,
) {
  const { toggleMode } = useMode();

  return (
    <Header {...props}>
      <Link href={appUrl}>
        <Logo className="mr-5 h-6" />
      </Link>
      <Navbar>
        <NavbarSection className="max-md:hidden">
          {nav.map(({ label, url, target = undefined, current = false }) => (
            <NavbarItem
              key={label}
              href={url}
              current={current}
              target={target}
            >
              {label}
            </NavbarItem>
          ))}
        </NavbarSection>
        <Spacer />
        <Button
          onClick={toggleMode}
          className="size-8 text-base transition-none md:text-sm [&_svg]:size-4 [&_svg]:text-muted-foreground"
          variant="ghost"
          suppressHydrationWarning
        >
          <SunIcon className="dark:hidden" />
          <MoonIcon className="hidden dark:block" />
        </Button>
      </Navbar>
    </Header>
  );
}

function Header({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "fixed top-0 right-[var(--removed-body-scroll-bar-size,0px)] left-0 z-10 h-(--header-height) border-b border-border/70 bg-background",
        className,
      )}
      {...props}
    >
      <div className="flex h-full items-center gap-3 pr-2 pl-2.5">
        {children}
      </div>
    </header>
  );
}

function Navbar({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("flex grow items-center gap-3", className)} {...props} />
  );
}

function NavbarSection({ className, ...props }: React.ComponentProps<"div">) {
  const id = useId();

  return (
    <LayoutGroup id={id}>
      <div {...props} className={cn("flex items-center gap-3", className)} />
    </LayoutGroup>
  );
}

const navbarItemClasses = cn(
  // Base
  "relative flex h-fit min-w-0 items-center gap-3 rounded-lg px-2 py-1 text-left text-base/6 sm:text-sm/5",
  // Leading icon/icon-only
  "data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5",
  // Trailing icon (down chevron or similar)
  "data-[slot=icon]:last:[&:not(:nth-child(2))]:*:ml-auto data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-5 sm:data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-4",
);

function NavbarItem({
  current,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> &
  React.ComponentProps<typeof Link> & {
    current?: boolean;
  }) {
  return (
    <span className={cn(className, "relative")}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className={cn(
            "absolute inset-x-2 -bottom-2 h-0.5 rounded-full bg-zinc-950 dark:bg-white",
          )}
          style={{ originY: "top" }}
        />
      )}
      {props?.href ? (
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            navbarItemClasses,
          )}
          data-current={current ? "true" : "false"}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <Button
          variant="ghost"
          className={navbarItemClasses}
          data-current={current ? "true" : "false"}
          {...props}
        >
          {children}
        </Button>
      )}
    </span>
  );
}

function Spacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div aria-hidden="true" className={cn("grow", className)} {...props} />
  );
}
