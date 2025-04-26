"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });

    // Log error to analytics or monitoring service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // You could send this to your error tracking service
    // Example: Sentry.captureException(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() =>
            this.setState({ hasError: false, error: null, errorInfo: null })
          }
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Auto-reset on route change if in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const handleRouteChange = () => {
        resetError();
      };

      window.addEventListener("popstate", handleRouteChange);
      return () => {
        window.removeEventListener("popstate", handleRouteChange);
      };
    }
  }, [resetError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[50vh] flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We apologize for the inconvenience. The application encountered an
            unexpected error.
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="mt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                {showDetails ? "Hide error details" : "Show error details"}
              </button>

              {showDetails && (
                <div className="mt-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-x-auto">
                  <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {error.stack || error.message}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={resetError}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { ErrorBoundaryClass as ErrorBoundary };
