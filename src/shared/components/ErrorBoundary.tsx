"use client";

import React, { memo } from "react";

const ErrorIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-destructive"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
));
ErrorIcon.displayName = "ErrorIcon";

const ErrorContent = memo(
  ({
    error,
    errorInfo,
    onReset,
  }: {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    onReset: () => void;
  }) => (
    <div className="max-w-md rounded-lg border border-destructive bg-destructive/5 p-8 shadow-lg">
      <div className="flex items-center gap-3">
        <ErrorIcon />
        <h2 className="text-xl font-bold text-destructive">
          Something went wrong
        </h2>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 p-4">
          <p className="font-mono text-sm text-destructive">{error.message}</p>
        </div>
      )}

      <p className="mt-4 text-muted-foreground">
        An unexpected error has occurred. Please try one of the following:
      </p>
      <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Refresh the page</li>
        <li>Clear your browser cache</li>
        <li>Try again later</li>
      </ul>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex-1 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Refresh Page
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded-md border border-destructive bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          Try Again
        </button>
      </div>

      {process.env.NODE_ENV === "development" && errorInfo && (
        <div className="mt-6">
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer font-medium">
              Stack trace
            </summary>
            <pre className="mt-2 max-h-[200px] overflow-auto rounded-md bg-destructive/10 p-4 font-mono text-xs text-destructive">
              {errorInfo.componentStack}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
);
ErrorContent.displayName = "ErrorContent";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <ErrorContent
              error={this.state.error}
              errorInfo={this.state.errorInfo}
              onReset={this.handleReset}
            />
          </div>
        )
      );
    }

    return this.props.children;
  }
}
