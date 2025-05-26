"use client";

import { useState } from "react";
import { getFetch, NetworkErrors } from "@/shared/utils/Http";
import { useNetwork } from "@/shared/providers/NetworkProvider";
import useNetworkErrorHandler from "@/shared/hooks/useNetworkErrorHandler";

export default function NetworkAwareComponent({ apiUrl }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useNetwork();
  const {
    error,
    errorMessage,
    errorType,
    executeWithErrorHandling,
    clearError,
    isNetworkError,
  } = useNetworkErrorHandler({
    onError: (err) => console.error("Custom error handling:", err),
  });

  // Example function to fetch data with network error handling
  const fetchData = async () => {
    try {
      setIsLoading(true);
      clearError();

      const result = await executeWithErrorHandling(getFetch, {
        url: apiUrl,
        timeout: 8000, // 8 second timeout
      });

      setData(result);
    } catch (err) {
      // Error is already handled by the hook
      console.log("Error caught in component:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get appropriate icon for error type
  const getErrorIcon = () => {
    if (!errorType) return null;

    switch (errorType) {
      case NetworkErrors.OFFLINE:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case NetworkErrors.TIMEOUT:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Network Aware Component</h2>
        {isOnline ? (
          <div className="flex items-center text-sm text-green-700">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="hidden sm:inline">Online</span>
          </div>
        ) : null}
      </div>

      {/* Error message display */}
      {error && (
        <div
          className={`border rounded-md p-4 mb-4 flex items-start ${
            isNetworkError
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div
            className={`mr-3 ${
              isNetworkError ? "text-red-500" : "text-amber-500"
            }`}
          >
            {getErrorIcon()}
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                isNetworkError ? "text-red-800" : "text-amber-800"
              }`}
            >
              {errorMessage}
            </p>
          </div>
          <button
            className={`${
              isNetworkError
                ? "text-red-400 hover:text-red-600"
                : "text-amber-400 hover:text-amber-600"
            }`}
            onClick={clearError}
            aria-label="Dismiss error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Data display */}
      {data && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={fetchData}
          disabled={isLoading || !isOnline}
          className={`px-4 py-2 rounded-md flex items-center ${
            isLoading || !isOnline
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            "Fetch Data"
          )}
        </button>

        {data && (
          <button
            onClick={() => setData(null)}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          >
            Clear Data
          </button>
        )}
      </div>
    </div>
  );
}
