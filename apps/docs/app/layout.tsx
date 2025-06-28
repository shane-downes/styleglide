import { RootProvider } from "fumadocs-ui/provider";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

const mona_sans = localFont({
  src: "../fonts/MonaSans[wdth,wght].ttf",
  variable: "--display-family",
});

const geist_mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${mona_sans.variable} ${geist_mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
