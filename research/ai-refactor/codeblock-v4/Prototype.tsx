"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";
import { CodeBlock, InlineCode, MarkdownRenderer, type CodeBlockEditPayload } from "yunui/content";
import { ChatMessage } from "yunui/chat";
import { CodeBlock as PatternCodeBlock } from "yunui/patterns";

type Sample = { id: string; title: string; code: string };
const longLine = `fetch('https://api.example.test/v1/very/long/resource/path?include=metadata,permissions,owners,versions&expand=related-records&format=json', { headers: { Authorization: 'Bearer example-token', 'Content-Type': 'application/json', 'X-Workspace-Id': 'workspace-2026', 'X-Request-Trace': 'trace-7f3d81e948' }, method: 'GET', signal: AbortSignal.timeout(12000) }).then((response) => response.ok ? response.json() : Promise.reject(new Error('Request failed: ' + response.status))).then(({ data }) => renderResource(data));`;
const samples: Sample[] = [
  { id: "3", title: "Short · 3 lines", code: `const route = "/docs/patterns/navbar";\nconst locales = ["en", "zh-CN", "zh-TW"];\nawait verifyRoute(route, locales);` },
  { id: "12", title: "Medium · 12 lines", code: Array.from({ length: 12 }, (_, i) => `const result${i + 1} = await checkRoute("/docs/patterns/navbar", "${["en", "zh-CN", "zh-TW"][i % 3]}");`).join("\n") },
  { id: "80", title: "Long · 80 lines", code: Array.from({ length: 80 }, (_, i) => `const result${i + 1} = await checkRoute("/docs/patterns/navbar", "${["en", "zh-CN", "zh-TW"][i % 3]}");`).join("\n") },
  { id: "long-line", title: "Single long line", code: longLine },
];

function scrollCodeWithKeyboard(event: ReactKeyboardEvent<HTMLElement>) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.tabIndex < 0) return;
  const step = 48;
  const previousLeft = target.scrollLeft;
  const previousTop = target.scrollTop;
  if (event.key === "ArrowRight" && target.scrollWidth > target.clientWidth) target.scrollLeft += step;
  else if (event.key === "ArrowLeft" && target.scrollWidth > target.clientWidth) target.scrollLeft -= step;
  else if (event.key === "ArrowDown" && target.scrollHeight > target.clientHeight) target.scrollTop += step;
  else if (event.key === "ArrowUp" && target.scrollHeight > target.clientHeight) target.scrollTop -= step;
  else if (event.key === "PageDown" && target.scrollHeight > target.clientHeight) target.scrollTop += target.clientHeight * 0.8;
  else if (event.key === "PageUp" && target.scrollHeight > target.clientHeight) target.scrollTop -= target.clientHeight * 0.8;
  else return;
  if (target.scrollLeft !== previousLeft || target.scrollTop !== previousTop) event.preventDefault();
}

function CompactCandidate({ code, language, filename, showLineNumbers, highlightLines, forceCopyFailure, onEdit }: { code: string; language: string; filename: string; showLineNumbers?: boolean; highlightLines?: number[]; forceCopyFailure?: boolean; onEdit?: (payload: CodeBlockEditPayload) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const expandControl = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const lines = code.split("\n");
  const shouldFold = lines.length > 16;
  const hasLongLine = lines.some((line) => line.length > 72);
  const copyFull = async () => {
    setCopyError(false);
    try {
      if (forceCopyFailure) throw new DOMException("Clipboard access denied by preview control", "NotAllowedError");
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); setCopyError(true); }
  };
  const preview = lines.slice(0, 8).join("\n");
  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    expandControl.current?.focus();
  }, [expanded]);
  const toggleExpanded = (next: boolean) => {
    restoreFocus.current = true;
    setExpanded(next);
  };
  return (
    <div className="v4-code" data-testid="candidate-code">
      <div className="v4-code-head">
        <span className="v4-code-file">{filename}</span>
        <span className="v4-code-lang">{language} <span aria-hidden="true">·</span> {lines.length} {lines.length === 1 ? "line" : "lines"}</span>
        {hasLongLine ? <span className="v4-scroll-cue">Scroll horizontally →</span> : null}
        {onEdit ? <button type="button" className="v4-copy" aria-label="Edit code" onClick={() => onEdit({ code, language, filename })}>Edit</button> : null}
        <button type="button" className="v4-copy" aria-label="Copy full code" onClick={copyFull}>{copied ? <Check size={14} /> : <Copy size={14} />}<span>{copied ? "Copied" : "Copy"}</span></button>
      </div>
      {copyError ? <p role="alert" className="v4-copy-error">Clipboard access was denied. Select the code and copy it manually.</p> : null}
      {shouldFold && !expanded ? (
        <>
          <div className="v4-preview" onKeyDownCapture={scrollCodeWithKeyboard} aria-label={`Code preview, first 8 of ${lines.length} lines`}><CodeBlock language={language} className="v4-public-preview" showLineNumbers={showLineNumbers} highlightLines={highlightLines}>{preview}</CodeBlock></div>
          <button ref={expandControl} type="button" className="v4-expand" aria-expanded="false" onClick={() => toggleExpanded(true)}>Show all {lines.length} lines</button>
        </>
      ) : (
        <>
          <div className="v4-full-code" onKeyDownCapture={scrollCodeWithKeyboard}><CodeBlock language={language} className="v4-public-code" showLineNumbers={showLineNumbers} highlightLines={highlightLines}>{code}</CodeBlock></div>
          {shouldFold ? <button ref={expandControl} type="button" className="v4-expand" aria-expanded="true" onClick={() => toggleExpanded(false)}>Show less</button> : null}
        </>
      )}
    </div>
  );
}

function PatternTabsCandidate({ code, tabs, showLineNumbers, forceCopyFailure }: { code: string; tabs: Array<{ id: string; label: string; code: string; language: string }>; showLineNumbers: boolean; forceCopyFailure?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState(tabs);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const expandControl = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const lines = code.split("\n");
  const lineCount = lines.length;
  const shouldFold = lineCount > 16;
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const orderedTabs = [activeTab, ...tabs.filter((tab) => tab.id !== activeTab.id)];
  const copyFull = async () => {
    setCopyError(false);
    try {
      if (forceCopyFailure) throw new DOMException("Clipboard access denied by preview control", "NotAllowedError");
      await navigator.clipboard.writeText(activeTab.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); setCopyError(true); }
  };
  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    expandControl.current?.focus();
  }, [expanded]);
  return (
    <div className={`v4-pattern-fold${expanded ? " is-expanded" : ""}`} onKeyDownCapture={scrollCodeWithKeyboard}>
      {shouldFold && !expanded ? (
        <>
          <div className="v4-pattern-meta">
            <div role="group" aria-label="Code sample format">{tabs.map((tab) => <button key={tab.id} type="button" aria-pressed={activeTabId === tab.id} onClick={() => { setActiveTabId(tab.id); setCopied(false); }}>{tab.label}</button>)}</div>
            <button type="button" className="v4-copy" aria-label="Copy full code" onClick={copyFull}>{copied ? <Check size={14} /> : <Copy size={14} />}<span>{copied ? "Copied" : "Copy"}</span></button>
          </div>
          {copyError ? <p role="alert" className="v4-copy-error">Clipboard access was denied. Select the code and copy it manually.</p> : null}
          <PatternCodeBlock code={activeTab.code.split("\n").slice(0, 8).join("\n")} language={activeTab.language} showLineNumbers={showLineNumbers} className="v4-pattern-compact v4-pattern-preview" />
          {tabs.some((tab) => tab.code.split("\n").some((line) => line.length > 72)) ? <p className="v4-pattern-scroll-cue">Long lines scroll horizontally inside the focused preview.</p> : null}
          <button ref={expandControl} type="button" className="v4-expand" aria-expanded="false" onClick={() => { setExpandedTabs(orderedTabs); restoreFocus.current = true; setExpanded(true); }}>Show all {lineCount} lines</button>
        </>
      ) : (
        <>
          <div onClickCapture={(event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const selected = tabs.find((tab) => tab.label === target.innerText.trim());
            if (selected) { setActiveTabId(selected.id); setCopied(false); }
          }}>
            <PatternCodeBlock code={expandedTabs[0]?.code ?? activeTab.code} language={expandedTabs[0]?.language ?? activeTab.language} tabs={expandedTabs} showLineNumbers={showLineNumbers} className="v4-pattern-compact" />
          </div>
          {tabs.some((tab) => tab.code.split("\n").some((line) => line.length > 72)) ? <p className="v4-pattern-scroll-cue">Long lines scroll horizontally inside the focused code area.</p> : null}
          {shouldFold ? <button ref={expandControl} type="button" className="v4-expand" aria-expanded="true" onClick={() => { restoreFocus.current = true; setExpanded(false); }}>Show less</button> : null}
        </>
      )}
    </div>
  );
}

export default function CodeBlockV4Prototype() {
  const [selected, setSelected] = useState("3");
  const [placement, setPlacement] = useState<"chat" | "article" | "tabs" | "direct">("chat");
  const [fontSize, setFontSize] = useState<13 | 14>(13);
  const [language, setLanguage] = useState<"ts" | "text">("ts");
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [highlightSecondLine, setHighlightSecondLine] = useState(false);
  const [longFilename, setLongFilename] = useState(false);
  const [editHandlerEnabled, setEditHandlerEnabled] = useState(true);
  const [clipboardDenied, setClipboardDenied] = useState(false);
  const [longTabLabels, setLongTabLabels] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark" | "true-black">("light");
  const [editEvent, setEditEvent] = useState("No edit callback has run.");
  const sample = useMemo(() => samples.find((item) => item.id === selected) ?? samples[0], [selected]);
  const codeLanguage = language === "text" ? "plaintext" : "typescript";
  const filename = longFilename ? "verify-navbar-locales-report.integration.test.ts" : "verify-navbar.ts";
  const highlightLines = highlightSecondLine ? [2] : [];
  const handleCodeEdit = editHandlerEnabled
    ? (payload: CodeBlockEditPayload) => setEditEvent(`onEdit received ${payload.filename} (${payload.code.split("\n").length} lines).`)
    : undefined;
  useEffect(() => {
    const root = document.documentElement;
    setPreviewTheme(root.classList.contains("true-black") ? "true-black" : root.classList.contains("dark") ? "dark" : "light");
  }, []);
  const chooseTheme = (theme: "light" | "dark" | "true-black") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "true-black");
    root.classList.add(theme);
    setPreviewTheme(theme);
  };
  const tabs = useMemo(() => {
    const count = sample.id === "3" ? 3 : sample.id === "12" ? 12 : sample.id === "80" ? 80 : 1;
    return [
      { id: "typescript", label: longTabLabels ? "TypeScript configuration validation" : "TypeScript", code: sample.code, language: "typescript" },
      { id: "python", label: longTabLabels ? "Python integration test" : "Python", code: Array.from({ length: count }, (_, i) => `result_${i + 1} = await check_route("/docs/patterns/navbar", "${["en", "zh-CN", "zh-TW"][i % 3]}")`).join("\n"), language: "python" },
      { id: "bash", label: longTabLabels ? "cURL release smoke test" : "cURL", code: Array.from({ length: count }, (_, i) => `curl -fsS "https://docs.example.test/${["en", "zh-CN", "zh-TW"][i % 3]}/docs/patterns/navbar"`).join("\n"), language: "bash" },
      ...(longTabLabels ? [{ id: "powershell", label: "PowerShell Windows compatibility check", code: Array.from({ length: count }, (_, i) => `Invoke-WebRequest -Uri "https://docs.example.test/${["en", "zh-CN", "zh-TW"][i % 3]}/docs/patterns/navbar" -Method Get`).join("\n"), language: "powershell" }] : []),
    ];
  }, [sample, longTabLabels]);
  const codeMetadata = `${language} filename=${filename}${showLineNumbers ? " showLineNumbers" : ""}${highlightSecondLine ? " {2}" : ""}`;
  const markdown = `I checked the Navbar docs against the release route.\n\nRun \`pnpm test\` after setting \`linkOrigin\`. Here is the exact verification snippet:\n\n\`\`\`${codeMetadata}\n${sample.code}\n\`\`\`\n\nThe route output is available in all three locales; the code is supporting detail, not the main response.`;
  return (
    <main className="v4-page" style={{ "--v4-code-size": `${fontSize}px` } as CSSProperties}>
      <header className="v4-top">
        <div><p className="v4-kicker">Research preview · no production changes</p><h1>CodeBlock v4 · embedded comparison</h1><p>Same story and code payload in the public MarkdownRenderer baseline and a compact candidate shell.</p></div>
        <div className="v4-controls" data-testid="codeblock-case-controls">
          <div role="group" aria-label="Code sample length">{samples.map((item) => <button key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.title}</button>)}</div>
          <div role="group" aria-label="Content placement">{(["chat", "article", "tabs", "direct"] as const).map((item) => <button key={item} aria-pressed={placement === item} onClick={() => setPlacement(item)}>{item === "chat" ? "Chat message" : item === "article" ? "Docs article" : item === "tabs" ? "Tabbed CodeBlock" : "Named CodeBlock"}</button>)}</div>
          <div role="group" aria-label="Candidate code text size">{([13, 14] as const).map((size) => <button key={size} aria-pressed={fontSize === size} onClick={() => setFontSize(size)}>{size} px</button>)}</div>
          <div role="group" aria-label="Code rendering details">
            <button aria-pressed={language === "ts"} onClick={() => setLanguage("ts")}>TypeScript</button>
            <button aria-pressed={language === "text"} onClick={() => setLanguage("text")}>Plain text</button>
            <button aria-pressed={showLineNumbers} onClick={() => setShowLineNumbers((value) => !value)}>Line numbers</button>
            <button aria-pressed={highlightSecondLine} onClick={() => setHighlightSecondLine((value) => !value)}>Highlight line 2</button>
          </div>
          <div role="group" aria-label="Host and layout edge cases">
            <button aria-pressed={longFilename} onClick={() => setLongFilename((value) => !value)}>Long filename</button>
            <button aria-pressed={editHandlerEnabled} onClick={() => setEditHandlerEnabled((value) => !value)}>Edit handler</button>
            <button aria-pressed={clipboardDenied} onClick={() => setClipboardDenied((value) => !value)}>Deny clipboard</button>
            <button aria-pressed={longTabLabels} onClick={() => setLongTabLabels((value) => !value)}>4 long-label tabs</button>
          </div>
          <div role="group" aria-label="Preview theme">{(["light", "dark", "true-black"] as const).map((theme) => <button key={theme} aria-pressed={previewTheme === theme} onClick={() => chooseTheme(theme)}>{theme === "true-black" ? "True black" : theme[0].toUpperCase() + theme.slice(1)}</button>)}</div>
        </div>
      </header>
      <div className="v4-compare">
        <section className="v4-column" aria-labelledby="baseline-title">
          <h2 id="baseline-title">Baseline · MarkdownRenderer</h2>
          <p className="v4-note">The public MarkdownRenderer routes this fence through the current Shiki CodeBlock.</p>
          {placement === "tabs" ? (
            <div className="v4-article"><h3>Install example</h3><p>Choose a command format to see how the same setup example fits into the guide.</p><PatternCodeBlock code={sample.code} language="typescript" tabs={tabs} showLineNumbers={showLineNumbers} /></div>
          ) : placement === "direct" ? (
            <ChatMessage role="assistant" name="Assistant" timestamp="9:41 AM" density="compact">
              <MarkdownRenderer content="The release check includes a named source file. Copy or edit it from this message." />
              <CodeBlock language={codeLanguage} filename={filename} showLineNumbers={showLineNumbers} highlightLines={highlightLines} onEdit={handleCodeEdit}>{sample.code}</CodeBlock>
              <MarkdownRenderer content="The code is part of the assistant response, with the message continuing below it." />
            </ChatMessage>
          ) : placement === "chat" ? (
            <ChatMessage role="assistant" name="Assistant" timestamp="9:41 AM" density="compact"><MarkdownRenderer content={markdown} onCodeEdit={handleCodeEdit} /></ChatMessage>
          ) : (
            <article className="v4-article"><h3>Navbar route checks</h3><MarkdownRenderer content={markdown} onCodeEdit={handleCodeEdit} /></article>
          )}
        </section>
        <section className="v4-column" aria-labelledby="candidate-title">
          <h2 id="candidate-title">Candidate · compact embedded mode</h2>
          <p className="v4-note">Same public Shiki CodeBlock in expanded state; line-count disclosure and complete-copy action are host preview behavior.</p>
          {placement === "tabs" ? (
            <div className="v4-article"><h3>Install example</h3><p>Choose a command format to see how the same setup example fits into the guide.</p><PatternTabsCandidate key={`${sample.id}-${showLineNumbers}`} code={sample.code} tabs={tabs} showLineNumbers={showLineNumbers} forceCopyFailure={clipboardDenied} /></div>
          ) : placement === "direct" ? (
            <ChatMessage role="assistant" name="Assistant" timestamp="9:41 AM" density="compact">
              <MarkdownRenderer content="The release check includes a named source file. Copy or edit it from this message." />
              <CompactCandidate code={sample.code} language={codeLanguage} filename={filename} showLineNumbers={showLineNumbers} highlightLines={highlightLines} forceCopyFailure={clipboardDenied} onEdit={handleCodeEdit} />
              <MarkdownRenderer content="The code is part of the assistant response, with the message continuing below it." />
            </ChatMessage>
          ) : placement === "chat" ? (
            <ChatMessage role="assistant" name="Assistant" timestamp="9:41 AM" density="compact">
              <MarkdownRenderer content="I checked the Navbar docs against the release route." />
              <p className="v4-inline-context">Run <InlineCode className="v4-inline-code">pnpm test</InlineCode> after setting <InlineCode className="v4-inline-code">linkOrigin</InlineCode>. Here is the exact verification snippet:</p>
              <CompactCandidate code={sample.code} language={codeLanguage} filename={filename} showLineNumbers={showLineNumbers} highlightLines={highlightLines} forceCopyFailure={clipboardDenied} onEdit={handleCodeEdit} />
              <MarkdownRenderer content="The route output is available in all three locales; the code is supporting detail, not the main response." />
            </ChatMessage>
          ) : (
            <article className="v4-article">
              <h3>Navbar route checks</h3>
              <MarkdownRenderer content="I checked the Navbar docs against the release route." />
              <p className="v4-inline-context">Run <InlineCode className="v4-inline-code">pnpm test</InlineCode> after setting <InlineCode className="v4-inline-code">linkOrigin</InlineCode>. Here is the exact verification snippet:</p>
              <CompactCandidate code={sample.code} language={codeLanguage} filename={filename} showLineNumbers={showLineNumbers} highlightLines={highlightLines} forceCopyFailure={clipboardDenied} onEdit={handleCodeEdit} />
              <MarkdownRenderer content="The route output is available in all three locales; the code is supporting detail, not the main response." />
            </article>
          )}
        </section>
      </div>
      {placement !== "tabs" ? <p className="v4-visually-hidden" role="status">{editEvent}</p> : null}
      <footer className="v4-foot">Review at 390 / 768 / 1440 px and light / dark. Copy uses the full source even while collapsed. Long lines do not wrap. This proposal has not been approved for production.</footer>
    </main>
  );
}
