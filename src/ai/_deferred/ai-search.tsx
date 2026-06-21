"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { cn } from "@/lib/cn";
import {
  Bot,
  Send,
  X,
  Loader2,
  PanelRightClose,
  PanelRight,
  GripVertical,
} from "lucide-react";
import { Markdown } from "@/components/markdown";
import { motion, AnimatePresence } from "framer-motion";

// Translations for Ask AI
const translations = {
  en: {
    title: "Ask AI",
    subtitle: "Yunxin Docs",
    placeholder: "Ask a question...",
    waiting: "Waiting...",
    thinking: "Thinking...",
    thinkingProcess: "Thinking process",
    clear: "Clear",
    close: "Close",
    expandSidebar: "Expand to sidebar",
    minimizePanel: "Minimize to floating panel",
    welcome: "Ask anything about Yunxin",
    welcomeDesc: "AI-powered answers from our documentation",
    disclaimer: "AI can make mistakes. Please double-check responses.",
    suggestions: {
      getStarted: "How to get started?",
      models: "What models are supported?",
      api: "How to use the API?",
    },
  },
  "zh-CN": {
    title: "AI 问答",
    subtitle: "Yunxin 文档",
    placeholder: "输入您的问题...",
    waiting: "等待中...",
    thinking: "思考中...",
    thinkingProcess: "思考过程",
    clear: "清空",
    close: "关闭",
    expandSidebar: "展开为侧边栏",
    minimizePanel: "最小化为浮动窗口",
    welcome: "询问关于 Yunxin 的任何问题",
    welcomeDesc: "基于文档的 AI 智能问答",
    disclaimer: "AI 可能会出错，请核实回答内容。",
    suggestions: {
      getStarted: "如何开始使用？",
      models: "支持哪些模型？",
      api: "如何使用 API？",
    },
  },
  "zh-TW": {
    title: "AI 問答",
    subtitle: "Yunxin 文件",
    placeholder: "輸入您的問題...",
    waiting: "等待中...",
    thinking: "思考中...",
    thinkingProcess: "思考過程",
    clear: "清空",
    close: "關閉",
    expandSidebar: "展開為側邊欄",
    minimizePanel: "最小化為浮動視窗",
    welcome: "詢問關於 Yunxin 的任何問題",
    welcomeDesc: "基於文件的 AI 智能問答",
    disclaimer: "AI 可能會出錯，請核實回答內容。",
    suggestions: {
      getStarted: "如何開始使用？",
      models: "支援哪些模型？",
      api: "如何使用 API？",
    },
  },
};

type Locale = keyof typeof translations;
type Translations = (typeof translations)[Locale];

function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    // Get locale from cookie
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    const cookieLocale = match ? decodeURIComponent(match[1]) : "en";

    // Map cookie locale to our supported locales
    if (cookieLocale === "zh-CN" || cookieLocale === "zh-cn") {
      setLocale("zh-CN");
    } else if (cookieLocale === "zh-TW" || cookieLocale === "zh-tw") {
      setLocale("zh-TW");
    }
  }, []);

  return locale;
}

function useTranslations() {
  const locale = useLocale();
  return translations[locale];
}

// Context for AI Search state
interface AISearchContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}

const AISearchContext = createContext<AISearchContextValue>({
  open: false,
  setOpen: () => {},
  expanded: false,
  setExpanded: () => {},
});

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <AISearchContext.Provider value={{ open, setOpen, expanded, setExpanded }}>
      {children}
    </AISearchContext.Provider>
  );
}

export function AISearchTrigger({
  children,
  className,
  position = "float",
}: {
  children: ReactNode;
  className?: string;
  position?: "float" | "inline";
}) {
  const { setOpen, expanded } = useContext(AISearchContext);

  // Hide trigger when panel is expanded (sidebar mode)
  if (expanded) return null;

  return (
    <motion.button
      type="button"
      onClick={() => setOpen(true)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        position === "float" &&
          "fixed bottom-6 right-6 z-50 shadow-lg rounded-full p-3",
        "inline-flex items-center gap-2 transition-colors",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

// Sidebar width constants
const SIDEBAR_MIN_WIDTH = 320;
const SIDEBAR_MAX_WIDTH = 600;
const SIDEBAR_DEFAULT_WIDTH = 400;

export function AISearchPanel() {
  const { open, setOpen, expanded, setExpanded } = useContext(AISearchContext);
  const t = useTranslations();
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sidebarPanelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    []
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onFinish: () => {
      // Scroll to bottom when message is complete
      setTimeout(scrollToBottom, 100);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Handle resize with improved detection
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(
        SIDEBAR_MIN_WIDTH,
        Math.min(SIDEBAR_MAX_WIDTH, newWidth)
      );
      setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }, [input, isLoading, sendMessage]);

  // Animation variants
  const floatingVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: sidebarWidth },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: sidebarWidth },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - only visible in sidebar mode */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
                onClick={() => setExpanded(false)}
              />
            )}
          </AnimatePresence>

          {/* Panel */}
          <motion.div
            ref={sidebarPanelRef}
            data-ai-chat-panel
            data-expanded={expanded}
            key={expanded ? "sidebar" : "floating"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={expanded ? sidebarVariants : floatingVariants}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 flex flex-col shadow-2xl overflow-hidden",
              "bg-fd-background border border-fd-border",
              expanded
                ? "inset-y-0 right-0 rounded-none border-l border-r-0 border-t-0 border-b-0"
                : "bottom-20 right-6 w-100 max-w-[calc(100vw-3rem)] h-130 max-h-[calc(100dvh-8rem)] rounded-xl"
            )}
            style={expanded ? { width: sidebarWidth } : undefined}
          >
            {/* Resize handle - larger hit area for easier dragging */}
            {expanded && (
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-4 -ml-2 cursor-ew-resize group z-10",
                  "flex items-center justify-center"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                }}
              >
                <div
                  className={cn(
                    "w-1 h-12 rounded-full transition-all duration-150",
                    isResizing
                      ? "bg-fd-primary/50"
                      : "bg-transparent group-hover:bg-fd-border group-active:bg-fd-primary/30"
                  )}
                />
                <div
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  )}
                >
                  <GripVertical className="size-4 text-fd-muted-foreground" />
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-fd-border bg-fd-muted/30">
              <div className="flex items-center gap-2">
                <Bot className="size-4.5 text-fd-primary" />
                <span className="text-sm font-medium text-fd-foreground">
                  {t.title}
                </span>
                <span className="text-xs text-fd-muted-foreground">
                  {t.subtitle}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="p-1.5 rounded-md text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
                  title={expanded ? t.minimizePanel : t.expandSidebar}
                >
                  {expanded ? (
                    <PanelRightClose className="size-3.5" />
                  ) : (
                    <PanelRight className="size-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setExpanded(false);
                  }}
                  className="p-1.5 rounded-md text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
                  title={t.close}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <Bot className="size-10 text-fd-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-medium text-fd-foreground">
                      {t.welcome}
                    </p>
                    <p className="text-xs text-fd-muted-foreground mt-1">
                      {t.welcomeDesc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {[
                      t.suggestions.getStarted,
                      t.suggestions.models,
                      t.suggestions.api,
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setInput("");
                          sendMessage({ text: q });
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg: UIMessage) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isLoading={
                      isLoading &&
                      msg.role === "assistant" &&
                      getMessageText(msg) === "" &&
                      messages[messages.length - 1]?.id === msg.id
                    }
                    t={t}
                  />
                ))
              )}
            </div>

            {/* Input */}
            <div className="border-t border-fd-border p-3 flex items-end gap-2 bg-fd-muted/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                rows={1}
                className="flex-1 resize-none bg-fd-background border border-fd-border rounded-lg px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-1 focus:ring-fd-ring min-h-9.5 max-h-30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={cn(
                  "p-2 rounded-lg transition-colors shrink-0",
                  input.trim()
                    ? "bg-fd-primary text-fd-primary-foreground hover:opacity-90"
                    : "bg-fd-muted text-fd-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="size-4" />
              </button>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-fd-border/50 flex items-center justify-between">
              <p className="text-[10px] text-fd-muted-foreground/60">
                {t.disclaimer}
              </p>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  {t.clear}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getMessageText(message: UIMessage): string {
  // AI SDK v6: check parts array first
  if (message.parts && message.parts.length > 0) {
    return message.parts
      .filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text")
      .map((p: { type: "text"; text: string }) => p.text)
      .join("");
  }
  // Fallback: check content property
  if (typeof (message as unknown as { content?: string }).content === "string") {
    return (message as unknown as { content: string }).content;
  }
  return "";
}

function getThinkingText(message: UIMessage): string | null {
  // Check for reasoning/thinking parts
  if (message.parts && message.parts.length > 0) {
    const thinkingParts = message.parts.filter(
      (p: { type: string }) => p.type === "reasoning"
    ) as { type: "reasoning"; text: string }[];
    if (thinkingParts.length > 0) {
      return thinkingParts.map((p) => p.text).join("");
    }
  }
  return null;
}

function ChatMessage({
  message,
  isLoading,
  t,
}: {
  message: UIMessage;
  isLoading?: boolean;
  t: Translations;
}) {
  const isUser = message.role === "user";
  const text = getMessageText(message);
  const thinking = getThinkingText(message);

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className="shrink-0 size-7 rounded-full bg-fd-primary/10 flex items-center justify-center">
          <Bot className="size-4 text-fd-primary" />
        </div>
      )}
      <div
        className={cn(
          "rounded-xl px-3.5 py-2.5 text-sm max-w-[85%]",
          isUser
            ? "bg-fd-primary text-fd-primary-foreground"
            : "bg-fd-muted/50 text-fd-foreground"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose-sm prose-fd [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_pre]:my-2 [&_code]:break-all">
            {/* Show thinking content if available */}
            {thinking && (
              <details className="mb-2">
                <summary className="cursor-pointer text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors list-none flex items-center gap-1.5">
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{t.thinkingProcess}</span>
                </summary>
                <div className="mt-2 p-2 bg-fd-background/50 rounded text-xs text-fd-muted-foreground whitespace-pre-wrap border border-fd-border">
                  {thinking}
                </div>
              </details>
            )}
            {text ? (
              <Markdown text={text} animate={false} />
            ) : isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-xs text-fd-muted-foreground">
                  {t.waiting}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
