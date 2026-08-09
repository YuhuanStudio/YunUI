"use client";

import { useTranslations } from "next-intl";
import { MarkdownRenderer } from "yunui/content";
import { version as PKG_VERSION } from "yunui/package.json";
import { CHANGELOG_MD } from "@/lib/changelog.generated";

// The changelog renders the package's own CHANGELOG.md through YunUI's
// MarkdownRenderer — one source of truth, dogfooding the content stack. The
// top `# Changelog` H1 is dropped so the page's own header owns the title.
const BODY = CHANGELOG_MD.replace(/^#\s+Changelog\s*\n/, "");

export default function ChangelogPage() {
  const t = useTranslations("changelog");
  return (
    // A <div>, not a <main>: the marketing Shell already wraps every page in
    // <main>, and nesting a second one gives /changelog two "main" landmarks.
    <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--accent-muted) bg-(--accent-subtle)/80 px-3 py-1 text-xs font-medium">
          v{PKG_VERSION}
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{t("subtitle")}</p>
      </header>
      <MarkdownRenderer content={BODY} />
    </div>
  );
}
