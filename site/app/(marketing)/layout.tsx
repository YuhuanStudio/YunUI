import type { ReactNode } from "react";
import { Shell } from "./shell";

// The marketing/showcase route (/) keeps its bespoke Shell (custom sidebar +
// header + footer). The docs routes (/docs) live outside this group and use
// fumadocs' DocsLayout instead.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
