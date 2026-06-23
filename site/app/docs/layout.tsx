import type { ReactNode } from "react";
import { DocsShell } from "./docs-shell";

/**
 * Docs chrome: the client `DocsShell` mounts fumadocs' DocsLayout with a
 * sidebar tree (built from our manifest) that localizes with the active client
 * locale. The fumadocs RootProvider (search + theme context) is mounted once in
 * app/providers.tsx.
 */
export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
