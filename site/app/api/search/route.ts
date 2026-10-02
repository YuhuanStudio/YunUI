import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Static, build-time search index over the docs manifest (title + description +
// keywords). fumadocs' search dialog (mounted via RootProvider) queries this.
const search = createFromSource(source);

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // This source has a full-text index only; it contains no embeddings for
  // Fumadocs' vector mode. Reject that unsupported option as a client error
  // instead of letting the search engine throw a server error.
  if (url.searchParams.get("mode") === "vector") {
    return Response.json(
      { error: "Vector search is not configured for this documentation source." },
      { status: 400 },
    );
  }

  return search.GET(request);
}
