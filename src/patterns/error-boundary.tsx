"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../index";

export interface ErrorBoundaryLabels {
  title?: string;
  message?: string;
  retry?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Override the default English copy. */
  labels?: ErrorBoundaryLabels;
  /** Notified when an error is caught (e.g. for logging). */
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({
  error,
  onRetry,
  labels,
}: {
  error: Error | null;
  onRetry: () => void;
  labels?: ErrorBoundaryLabels;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 p-8">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{labels?.title ?? "Something went wrong"}</h2>
      <p className="text-muted-foreground text-center mb-4 max-w-md">
        {error?.message || labels?.message || "An unexpected error occurred."}
      </p>
      <Button variant="secondary" onClick={onRetry} className="whitespace-nowrap">
        <RefreshCw size={16} />
        {labels?.retry ?? "Try again"}
      </Button>
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} labels={this.props.labels} />;
    }
    return this.props.children;
  }
}
