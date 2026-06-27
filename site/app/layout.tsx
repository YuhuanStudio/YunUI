import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { COOKIE_NAME, DEFAULT_LOCALE, isLocale } from "@/i18n/config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YunUI — quietly beautiful, quietly engineered",
  description:
    "A React 19 + Tailwind v4 design system that doesn't shout — token-driven, three themes, and a framework-agnostic adapter layer. Every detail considered, none of them loud.",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/yuhuanstudio-logo.png" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve the locale on the server from the NEXT_LOCALE cookie so the rendered
  // HTML is already in the user's language (no first-paint flash, no hydration
  // mismatch). Reading the cookie opts every route into dynamic rendering.
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
