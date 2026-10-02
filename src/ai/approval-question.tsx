"use client";

import { useId, type ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button, Checkbox, RadioGroup, RadioGroupItem } from "../primitives";
import { cn } from "../lib/cn";

/** A stable-id answer choice in a host-owned questionnaire. */
export interface ApprovalQuestionOption {
    id: string;
    label: ReactNode;
    detail?: ReactNode;
    disabled?: boolean;
}

export interface ApprovalQuestionOtherOption {
    /** Stable ID stored in `optionIds`; do not use the option's array index. */
    id: string;
    label: ReactNode;
    placeholder?: string;
}

/** Data for one question. This collects answers; it does not authorize a tool action. */
export interface ApprovalQuestionData {
    id: string;
    title: string;
    message?: ReactNode;
    type: "single" | "multiple";
    options: readonly ApprovalQuestionOption[];
    other?: ApprovalQuestionOtherOption;
    required?: boolean;
}

export interface ApprovalQuestionAnswer {
    optionIds: readonly string[];
    otherText?: string;
}

export type ApprovalQuestionAnswers = Readonly<Record<string, ApprovalQuestionAnswer>>;

export interface ApprovalQuestionLabels {
    dismiss?: string;
    back?: string;
    next?: string;
    skip?: string;
    submit?: string;
    submitting?: string;
    otherPlaceholder?: string;
    progress?: (current: number, total: number) => string;
}

export interface ApprovalQuestionProps {
    questions: readonly ApprovalQuestionData[];
    /** The host controls which stable question ID is visible. */
    activeQuestionId: string;
    /** Controlled answers keyed by stable question ID, containing stable option IDs. */
    answers: ApprovalQuestionAnswers;
    onAnswersChange: (answers: ApprovalQuestionAnswers) => void;
    onActiveQuestionChange?: (id: string) => void;
    onSkip?: (questionId: string) => void;
    onSubmit?: (answers: ApprovalQuestionAnswers) => void;
    /** Requests dismissal; the host decides whether to hide or cancel this question. */
    onDismiss?: () => void;
    /** Host-controlled request in flight; choices and navigation are disabled until it changes. */
    submitting?: boolean;
    /** Host-controlled read-only state. */
    disabled?: boolean;
    labels?: ApprovalQuestionLabels;
    className?: string;
}

const DEFAULT_LABELS: Required<Omit<ApprovalQuestionLabels, "progress">> = {
    dismiss: "Dismiss questions",
    back: "Back",
    next: "Next",
    skip: "Skip",
    submit: "Submit answers",
    submitting: "Submitting…",
    otherPlaceholder: "Something else…",
};

function domPart(value: string) {
    return Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? "0").join("-") || "empty";
}

/** Controlled, explicit-step questionnaire adapted from Beautiful UI ApprovalCard's
 * question/choice interaction (commit 44a274e598395ab61e7c96c26fda2758780253b7,
 * components/primitives/ApprovalCard.tsx, MIT). It deliberately uses stable host
 * IDs rather than array indexes, and a questionnaire submit never approves or
 * executes a tool. Upstream MIT attribution is preserved in
 * `licenses/beautiful-ui-MIT.txt`.
 */
export function ApprovalQuestion({
    questions,
    activeQuestionId,
    answers,
    onAnswersChange,
    onActiveQuestionChange,
    onSkip,
    onSubmit,
    onDismiss,
    submitting = false,
    disabled = false,
    labels,
    className,
}: ApprovalQuestionProps) {
    const generatedId = useId();
    const questionIndex = questions.findIndex((question) => question.id === activeQuestionId);
    const question = questions[questionIndex];
    if (!question) return null;

    const copy = {
        dismiss: labels?.dismiss ?? DEFAULT_LABELS.dismiss,
        back: labels?.back ?? DEFAULT_LABELS.back,
        next: labels?.next ?? DEFAULT_LABELS.next,
        skip: labels?.skip ?? DEFAULT_LABELS.skip,
        submit: labels?.submit ?? DEFAULT_LABELS.submit,
        submitting: labels?.submitting ?? DEFAULT_LABELS.submitting,
        otherPlaceholder: labels?.otherPlaceholder ?? DEFAULT_LABELS.otherPlaceholder,
    };
    const answer = answers[question.id] ?? { optionIds: [] };
    const hasSelection = answer.optionIds.some((id) =>
        question.options.some((option) => option.id === id && !option.disabled),
    );
    const hasOtherText = Boolean(question.other && answer.optionIds.includes(question.other.id) && answer.otherText?.trim());
    const canContinue = question.required === false || hasSelection || hasOtherText;
    const isLast = questionIndex === questions.length - 1;

    const updateAnswer = (next: ApprovalQuestionAnswer) => {
        onAnswersChange({ ...answers, [question.id]: next });
    };
    const toggleOption = (optionId: string) => {
        const option = question.options.find((item) => item.id === optionId);
        const isOtherOption = question.other?.id === optionId;
        if ((!option && !isOtherOption) || option?.disabled) return;
        const current = answer.optionIds;
        const selected = current.includes(optionId);
        const optionIds = question.type === "single"
            ? [optionId]
            : selected ? current.filter((id) => id !== optionId) : [...current, optionId];
        updateAnswer({
            ...answer,
            optionIds,
            ...(question.type === "single" && question.other && optionId !== question.other.id ? { otherText: "" } : {}),
        });
    };
    const continueQuestion = () => {
        if (!canContinue) return;
        if (isLast) {
            onSubmit?.(answers);
            return;
        }
        if (onActiveQuestionChange) onActiveQuestionChange(questions[questionIndex + 1].id);
    };

    return (
        <section data-yunui="approval-question" className={cn("w-full max-w-md rounded-xl border border-border/70 bg-card p-3.5 shadow-none", className)} aria-labelledby={`${generatedId}-title`} aria-busy={submitting || undefined}>
            <div className="mb-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div aria-live="polite" aria-atomic="true">
                        <p className="mb-1 text-xs text-muted-foreground">{labels?.progress?.(questionIndex + 1, questions.length) ?? `Question ${questionIndex + 1} of ${questions.length}`}</p>
                        <h3 id={`${generatedId}-title`} className="text-sm font-semibold text-foreground">{question.title}</h3>
                    </div>
                    {question.message != null ? <div className="mt-1 text-xs text-muted-foreground">{question.message}</div> : null}
                </div>
                {onDismiss ? <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground" disabled={disabled || submitting} onClick={onDismiss} aria-label={copy.dismiss}><X aria-hidden className="h-3.5 w-3.5" /></Button> : null}
            </div>

            <fieldset className="min-w-0" aria-labelledby={`${generatedId}-title`}>
                <legend className="sr-only">{question.title}</legend>
                {question.type === "single" ? (
                    <RadioGroup
                        value={answer.optionIds.find((id) => id === question.other?.id || question.options.some((option) => option.id === id)) ?? ""}
                        onValueChange={toggleOption}
                        disabled={disabled || submitting}
                        orientation="vertical"
                        className="gap-0"
                    >
                        {question.options.map((option) => {
                            const checked = answer.optionIds.includes(option.id);
                            const inputId = `${generatedId}-${domPart(question.id)}-${domPart(option.id)}`;
                            const labelId = `${inputId}-label`;
                            return (
                                <div key={option.id} className={cn("transition-colors", checked && "bg-muted/50", !option.disabled && !disabled && !submitting && "hover:bg-muted/50")}>
                                    <label htmlFor={inputId} className={cn("flex min-h-9 cursor-pointer items-start gap-2.5 px-2 py-1.5", (option.disabled || disabled || submitting) && "cursor-not-allowed opacity-50")}>
                                        <RadioGroupItem id={inputId} value={option.id} disabled={disabled || submitting || option.disabled} aria-labelledby={labelId} className="mt-0.5" />
                                        <span id={labelId} className="min-w-0 flex-1 text-sm text-foreground">
                                            <span className="block">{option.label}</span>
                                            {option.detail != null ? <span className="mt-0.5 block text-xs text-muted-foreground">{option.detail}</span> : null}
                                        </span>
                                    </label>
                                </div>
                            );
                        })}
                        {question.other ? (() => {
                            const otherSelected = answer.optionIds.includes(question.other!.id);
                            const otherId = `${generatedId}-${domPart(question.id)}-${domPart(question.other!.id)}`;
                            const otherLabelId = `${otherId}-label`;
                            return (
                                <div key={question.other.id} className={cn("transition-colors", otherSelected && "bg-muted/50", !disabled && !submitting && "hover:bg-muted/50")}>
                                    <label htmlFor={otherId} className={cn("flex min-h-9 cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm text-foreground", (disabled || submitting) && "cursor-not-allowed opacity-50")}>
                                        <RadioGroupItem id={otherId} value={question.other.id} disabled={disabled || submitting} aria-labelledby={otherLabelId} />
                                        <span id={otherLabelId}>{question.other.label}</span>
                                    </label>
                                    {otherSelected ? (
                                        <input
                                            value={answer.otherText ?? ""}
                                            disabled={disabled || submitting}
                                            onChange={(event) => updateAnswer({ ...answer, otherText: event.target.value })}
                                            placeholder={question.other.placeholder ?? copy.otherPlaceholder}
                                            aria-label={question.other.placeholder ?? copy.otherPlaceholder}
                                            className="mb-2 ml-9 w-[calc(100%-2.75rem)] rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    ) : null}
                                </div>
                            );
                        })() : null}
                    </RadioGroup>
                ) : (
                    <div className="flex flex-col gap-0">
                        {question.options.map((option) => {
                            const checked = answer.optionIds.includes(option.id);
                            const inputId = `${generatedId}-${domPart(question.id)}-${domPart(option.id)}`;
                            const labelId = `${inputId}-label`;
                            return (
                                <label key={option.id} htmlFor={inputId} className={cn("flex min-h-9 cursor-pointer items-start gap-2.5 px-2 py-1.5 transition-colors", checked && "bg-muted/50", !option.disabled && !disabled && !submitting && "hover:bg-muted/50", (option.disabled || disabled || submitting) && "cursor-not-allowed opacity-50")}>
                                    <Checkbox id={inputId} checked={checked} disabled={disabled || submitting || option.disabled} onCheckedChange={() => toggleOption(option.id)} aria-labelledby={labelId} className="mt-0.5" />
                                    <span id={labelId} className="min-w-0 flex-1 text-sm text-foreground">
                                        <span className="block">{option.label}</span>
                                        {option.detail != null ? <span className="mt-0.5 block text-xs text-muted-foreground">{option.detail}</span> : null}
                                    </span>
                                </label>
                            );
                        })}
                        {question.other ? (() => {
                            const otherSelected = answer.optionIds.includes(question.other!.id);
                            const otherId = `${generatedId}-${domPart(question.id)}-${domPart(question.other!.id)}`;
                            const otherLabelId = `${otherId}-label`;
                            return (
                                <div className={cn("transition-colors", otherSelected && "bg-muted/50")}>
                                    <label htmlFor={otherId} className={cn("flex min-h-9 cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm text-foreground transition-colors", !disabled && !submitting && "hover:bg-muted/50", (disabled || submitting) && "cursor-not-allowed opacity-50")}>
                                        <Checkbox id={otherId} checked={otherSelected} disabled={disabled || submitting} onCheckedChange={() => toggleOption(question.other!.id)} aria-labelledby={otherLabelId} />
                                        <span id={otherLabelId}>{question.other.label}</span>
                                    </label>
                                    {otherSelected ? (
                                        <input
                                            value={answer.otherText ?? ""}
                                            disabled={disabled || submitting}
                                            onChange={(event) => updateAnswer({ ...answer, otherText: event.target.value })}
                                            placeholder={question.other.placeholder ?? copy.otherPlaceholder}
                                            aria-label={question.other.placeholder ?? copy.otherPlaceholder}
                                            className="mb-2 ml-9 w-[calc(100%-2.75rem)] rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    ) : null}
                                </div>
                            );
                        })() : null}
                    </div>
                )}
            </fieldset>

            <div className="mt-3 flex items-center justify-between gap-2">
                <Button type="button" variant="ghost" size="sm" disabled={disabled || submitting || questionIndex === 0 || !onActiveQuestionChange} onClick={() => onActiveQuestionChange?.(questions[questionIndex - 1].id)}>
                    {copy.back}
                </Button>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" disabled={disabled || submitting || !onSkip} onClick={() => onSkip?.(question.id)}>
                        {copy.skip}
                    </Button>
                    <Button type="button" variant="primary" size="sm" disabled={disabled || submitting || !canContinue || (isLast ? !onSubmit : !onActiveQuestionChange)} onClick={continueQuestion}>
                        {isLast ? (submitting ? copy.submitting : copy.submit) : copy.next}
                        {!isLast ? <ArrowRight aria-hidden className="ml-1 h-3.5 w-3.5" /> : null}
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default ApprovalQuestion;
