import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YunUI — the design system you build once, and ship everywhere",
  description:
    "A React 19 + Tailwind v4 component library with tokens, 3 themes, and a framework-agnostic adapter layer. Edit once, version, sync every project.",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/yuhuanstudio-logo.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
