"use client";

import { useState } from "react";
import { useNetwork } from "@/shared/providers/NetworkProvider";
import { isOffline, NetworkErrors } from "@/shared/utils/Http";

/**
 * A custom hook to handle network errors in API calls
 * @param {object} options - Options for the hook
 * @param {Function} options.onError - Additional error handler to run
 * @returns {object} - Error state and handler functions
 */
export function useNetworkErrorHandler({ onError } = {}) {
  const [error, setError] = useState(null);
  const { isOnline } = useNetwork();

  /**
   * Execute an async function with network error handling
   * @param {Function} asyncFn - The async function to execute
   * @param {Array} args - Arguments to pass to the async function
   * @returns {Promise<any>} - The result of the async function
   */
  const executeWithErrorHandling = async (asyncFn, ...args) => {
    // Clear previous errors
    setError(null);

    // Check if online before making request
    if (!isOnline) {
      const offlineError = new Error(
        "You're currently offline. Please check your connection and try again."
      );
      offlineError.type = NetworkErrors.OFFLINE;
      setError(offlineError);

      if (onError) {
        onError(offlineError);
      }

      throw offlineError;
    }

    try {
      return await asyncFn(...args);
    } catch (err) {
      // Our HTTP utils now already format errors properly
      setError(err);

      // Run additional error handler if provided
      if (onError) {
        onError(err);
      }

      throw err;
    }
  };

  /**
   * Get appropriate error message for different error types
   */
  const getErrorMessage = () => {
    if (!error) return null;

    if (error.type === NetworkErrors.OFFLINE) {
      return "You're currently offline. Please check your connection and try again.";
    }

    return error.message || "An error occurred. Please try again.";
  };

  return {
    error,
    errorMessage: getErrorMessage(),
    errorType: error?.type || null,
    executeWithErrorHandling,
    clearError: () => setError(null),
    isNetworkError:
      error?.type && Object.values(NetworkErrors).includes(error.type),
  };
}

export default useNetworkErrorHandler;
