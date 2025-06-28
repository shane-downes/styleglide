import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ["typescript", "twoslash"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/theme-editor-package",
        permanent: false,
      },
    ];
  },
};

export default withMDX(config);
