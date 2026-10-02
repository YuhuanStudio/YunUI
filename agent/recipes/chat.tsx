"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageList,
  type ChatComposerCommand,
  type ChatComposerLabels,
  type ChatComposerMenuItem,
  type ChatComposerModel,
  type ChatRole,
} from "@yuhuanowo/yunui/chat";
import {
  AgentRunStatus,
  AgentTimeline,
  type AgentRunState,
  type AgentTimelineEntry,
} from "@yuhuanowo/yunui/ai";
import { MarkdownRenderer } from "@yuhuanowo/yunui/content";

export interface ConversationMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface YunUIConversationProps {
  messages: ConversationMessage[];
  /** Legacy reasoning/tool/approval rows and additive task/cancelled rows. */
  blocks: AgentTimelineEntry[];
  /** Retained boolean for simple consumers; map richer runtime phases with runPhase. */
  running: boolean;
  runPhase?: AgentRunState;
  runLabel?: string;
  /** Resolve after host acceptance; return false or reject to retain the draft. */
  onSend: (text: string) => void | boolean | Promise<void | boolean>;
  onSendError?: (error: unknown) => void;
  onStop: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  sourceItems?: readonly ChatComposerMenuItem[];
  selectedSourceIds?: readonly string[];
  onSourceToggle?: (id: string, selected: boolean) => void;
  commandItems?: readonly ChatComposerCommand[];
  onCommandSelect?: (item: ChatComposerCommand) => void;
  modelItems?: readonly ChatComposerModel[];
  selectedModelId?: string;
  onModelChange?: (id: string) => void;
  composerLabels?: ChatComposerLabels;
  attachments?: ReactNode;
  toolbar?: ReactNode;
  title?: ReactNode;
  /** Host-composed ApprovalQuestion or other public conversational blocks. */
  approval?: ReactNode;
}

/**
 * Full chat composition using YunUI's public chat, AI and content exports.
 * The host owns message history, menu data, runtime phases and every side
 * effect; this recipe adds no transport, model call or simulated reply.
 */
export function YunUIConversation({
  messages,
  blocks,
  running,
  runPhase,
  runLabel,
  onSend,
  onSendError,
  onStop,
  onApprove,
  onReject,
  sourceItems,
  selectedSourceIds,
  onSourceToggle,
  commandItems,
  onCommandSelect,
  modelItems,
  selectedModelId,
  onModelChange,
  composerLabels,
  attachments,
  toolbar,
  title,
  approval,
}: YunUIConversationProps) {
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const phase = runPhase ?? (running ? "acting" : "waiting");
  const label = runLabel ?? (running ? "Working" : "Ready");
  let lastAssistantIndex = -1;
  messages.forEach((message, index) => { if (message.role === "assistant") lastAssistantIndex = index; });

  const send = async () => {
    if (pending.current || running || !draft.trim()) return;
    const captured = draft;
    pending.current = true;
    setSubmitting(true);
    try {
      const accepted = await onSend(captured);
      if (accepted !== false) setDraft(current => current === captured ? "" : current);
    } catch (error) {
      onSendError?.(error);
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <ChatHeader left={title ?? "Conversation"} />
      <ChatMessageList className="px-4" empty="Start a conversation.">
        {messages.map((message, index) => (
          <ChatMessage key={message.id} role={message.role} density="compact" badges={index === lastAssistantIndex ? <AgentRunStatus label={label} phase={phase} /> : undefined}>
            <MarkdownRenderer content={message.content} />
            {index === lastAssistantIndex && blocks.length > 0 ? <AgentTimeline blocks={blocks} onApprove={onApprove} onReject={onReject} /> : null}
            {index === lastAssistantIndex ? approval : null}
          </ChatMessage>
        ))}
        {lastAssistantIndex < 0 && (blocks.length > 0 || approval) ? (
          <ChatMessage role="assistant" density="compact" badges={<AgentRunStatus label={label} phase={phase} />}>
            {blocks.length > 0 ? <AgentTimeline blocks={blocks} onApprove={onApprove} onReject={onReject} /> : null}
            {approval}
          </ChatMessage>
        ) : null}
      </ChatMessageList>
      <div className="p-4">
        <ChatComposer
          value={draft}
          onChange={setDraft}
          loading={running}
          onStop={onStop}
          onSend={() => { void send(); }}
          sendDisabled={submitting}
          sourceItems={sourceItems}
          selectedSourceIds={selectedSourceIds}
          onSourceToggle={onSourceToggle}
          commandItems={commandItems}
          onCommandSelect={onCommandSelect}
          modelItems={modelItems}
          selectedModelId={selectedModelId}
          onModelChange={onModelChange}
          labels={composerLabels}
          attachments={attachments}
          toolbar={toolbar}
        />
      </div>
    </div>
  );
}
