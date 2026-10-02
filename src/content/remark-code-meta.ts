/** Safe Markdown fenced-code metadata for MarkdownRenderer.
 *
 * ReactMarkdown's className contains the fence language but does not carry the
 * mdast code node's `meta` string. Convert only the small supported metadata
 * vocabulary to sanitizer-allowlisted class tokens; never forward arbitrary
 * info-string attributes or raw HTML properties.
 */

const MAX_META_LENGTH = 1024;
const MAX_FILENAME_LENGTH = 128;
const MAX_HIGHLIGHT_RANGES = 32;
const filenameClassPattern = /^filename-[A-Za-z0-9._~%\-]{1,1152}$/;
const languagePattern = /^[A-Za-z0-9_+-]{1,32}$/;
const highlightPattern = /^\{((?:\d{1,16}(?:-\d{1,16})?)(?:,\d{1,16}(?:-\d{1,16})?)*)\}$/;
const controlCharacterPattern = /[\u0000-\u001f\u007f]/;

interface RemarkNode {
  type?: string;
  lang?: unknown;
  meta?: unknown;
  data?: unknown;
  children?: RemarkNode[];
}

interface FenceOptions {
  showLineNumbers: boolean;
  highlightRange?: string;
  filename?: string;
}

function tokenizeMeta(meta: string): string[] {
  if (meta.length > MAX_META_LENGTH) return [];

  const tokens: string[] = [];
  let token = "";
  let quote: "\"" | "'" | undefined;
  let tokenStarted = false;

  const finishToken = () => {
    if (tokenStarted) tokens.push(token);
    token = "";
    tokenStarted = false;
  };

  for (let index = 0; index < meta.length; index += 1) {
    const character = meta[index];

    if (quote) {
      if (character === "\\" && index + 1 < meta.length) {
        const next = meta[index + 1];
        if (next === quote || next === "\\") {
          token += next;
          index += 1;
        } else {
          token += character;
        }
      } else if (character === quote) {
        quote = undefined;
      } else {
        token += character;
      }
      tokenStarted = true;
      continue;
    }

    if (character === "\"" || character === "'") {
      quote = character;
      tokenStarted = true;
    } else if (/\s/.test(character)) {
      finishToken();
    } else {
      token += character;
      tokenStarted = true;
    }
  }

  // An unclosed quote makes only its unfinished token invalid. Earlier
  // explicitly closed options remain independently safe to honor.
  if (!quote) finishToken();
  return tokens;
}

function isHighlightRange(value: string): boolean {
  const match = highlightPattern.exec(value);
  return Boolean(match && match[1].split(",").length <= MAX_HIGHLIGHT_RANGES);
}

function encodeFilename(value: string): string | undefined {
  if (!value || value.length > MAX_FILENAME_LENGTH || controlCharacterPattern.test(value)) return undefined;
  try {
    // encodeURIComponent leaves these punctuation marks unescaped; encode them
    // too so the resulting class token stays inside the strict safe grammar.
    const encoded = encodeURIComponent(value).replace(/[!'()*]/g, character =>
      `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
    );
    return encoded.length <= MAX_FILENAME_LENGTH * 9 ? encoded : undefined;
  } catch {
    // For example, reject malformed UTF-16 surrogate sequences.
    return undefined;
  }
}

/** Decode a filename token emitted by `remarkCodeMeta` after sanitization. */
export function decodeCodeFilenameClass(value: string): string | undefined {
  if (!filenameClassPattern.test(value)) return undefined;
  try {
    const filename = decodeURIComponent(value.slice("filename-".length));
    if (!filename || filename.length > MAX_FILENAME_LENGTH || controlCharacterPattern.test(filename)) return undefined;
    return filename;
  } catch {
    return undefined;
  }
}

function parseFenceOptions(meta: string): FenceOptions {
  const options: FenceOptions = { showLineNumbers: false };

  for (const token of tokenizeMeta(meta)) {
    if (token === "showLineNumbers") {
      options.showLineNumbers = true;
    } else if (!options.highlightRange && isHighlightRange(token)) {
      options.highlightRange = token;
    } else if (!options.filename && token.startsWith("filename=")) {
      const encoded = encodeFilename(token.slice("filename=".length));
      if (encoded) options.filename = encoded;
    }
  }

  return options;
}

function visit(node: RemarkNode, callback: (node: RemarkNode) => void): void {
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, callback);
  }
}

/**
 * Translate only `showLineNumbers`, bounded `{line-ranges}`, and
 * `filename="..."` from Markdown fence info into safe code class tokens.
 * Unknown metadata is ignored. HTML attrs, styles, events, URLs and arbitrary
 * props never enter HAST through this plugin.
 */
export function remarkCodeMeta() {
  return (tree: RemarkNode): void => {
    visit(tree, node => {
      if (node.type !== "code" || typeof node.meta !== "string") return;

      const options = parseFenceOptions(node.meta);
      if (!options.showLineNumbers && !options.highlightRange && !options.filename) return;

      const className: string[] = [];
      if (typeof node.lang === "string") {
        const language = node.lang.trim().split(/\s+/)[0];
        if (languagePattern.test(language)) className.push(`language-${language}`);
      }
      if (options.showLineNumbers) className.push("showLineNumbers");
      if (options.highlightRange) className.push(options.highlightRange);
      if (options.filename) className.push(`filename-${options.filename}`);

      const existing = node.data && typeof node.data === "object"
        ? node.data as { [key: string]: unknown }
        : {};
      // Do not spread arbitrary info-string data into HTML properties. Code
      // metadata is the only generated property and sanitizer validates each
      // class against a narrow schema before ReactMarkdown renders it.
      node.data = {
        ...existing,
        hProperties: { className },
      };
    });
  };
}
