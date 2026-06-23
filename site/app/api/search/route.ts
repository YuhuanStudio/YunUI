import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Static, build-time search index over the docs manifest (title + description +
// keywords). fumadocs' search dialog (mounted via RootProvider) queries this.
export const { GET } = createFromSource(source);
