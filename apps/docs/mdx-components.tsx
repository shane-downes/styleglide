import * as Twoslash from "fumadocs-twoslash/ui";
import { Callout } from "fumadocs-ui/components/callout";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { cn } from "fumadocs-ui/utils/cn";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // HTML `ref` attribute conflicts with `forwardRef`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pre: ({ ref: _ref, className, ...props }) => (
      <CodeBlock className={cn("bg-card", className)} {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    Callout: ({ className, ...props }) => (
      <Callout
        {...props}
        className={cn("shadow-none border-s-border border-s", className)}
      />
    ),
    ...Twoslash,
    ...TabsComponents,
    ...components,
  };
}
