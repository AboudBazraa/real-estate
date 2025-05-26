export function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

export async function checkNetworkConnection() {
  if (isOffline()) {
    throw new Error(
      "You're currently offline. Please check your connection and try again."
    );
  }
}

export const NetworkErrors = {
  OFFLINE: "OFFLINE",
  TIMEOUT: "TIMEOUT",
  SERVER_ERROR: "SERVER_ERROR",
  CONNECTION_ERROR: "CONNECTION_ERROR",
};

/**
 * Format error message based on error type
 * @param {Error} error - The error object
 * @returns {Object} - Formatted error object with type and user-friendly message
 */
export function formatNetworkError(error) {
  // Default error
  let errorObject = {
    type: "UNKNOWN_ERROR",
    message: error.message || "An unknown error occurred.",
  };

  // Check for offline status first
  if (isOffline()) {
    return {
      type: NetworkErrors.OFFLINE,
      message:
        "You're currently offline. Please check your connection and try again.",
    };
  }

  // Check for timeout
  if (error.name === "AbortError") {
    return {
      type: NetworkErrors.TIMEOUT,
      message: "Request timed out. Please try again.",
    };
  }

  // Check for network errors
  if (error.name === "TypeError" && error.message === "Failed to fetch") {
    return {
      type: NetworkErrors.CONNECTION_ERROR,
      message:
        "Unable to connect to the server. Please check your internet connection.",
    };
  }

  // Server errors
  if (
    error.status >= 500 ||
    (error.message && error.message.includes("HTTP error! status: 5"))
  ) {
    return {
      type: NetworkErrors.SERVER_ERROR,
      message:
        "Server error. Our team has been notified and is working on a fix.",
    };
  }

  return errorObject;
}

export async function getFetch({ signal, search, url, timeout = 10000 }) {
  try {
    // Check network connection first
    await checkNetworkConnection();

    // Base URL should be configured - replace with your actual API base URL
    const baseUrl = process.env.API_URL || url;

    // Build URL with proper encoding
    const Url = new URL(baseUrl);
    if (search) {
      Url.searchParams.append("search", search);
    }

    // Create abort controller for timeout if one wasn't passed
    let abortController;
    let timeoutId;

    if (!signal) {
      abortController = new AbortController();
      signal = abortController.signal;

      // Set timeout
      timeoutId = setTimeout(() => {
        abortController.abort();
      }, timeout);
    }

    const response = await fetch(Url.toString(), { signal });

    // Clear timeout if we set it
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);

    const formattedError = formatNetworkError(error);
    const enhancedError = new Error(formattedError.message);
    enhancedError.type = formattedError.type;
    enhancedError.originalError = error;

    throw enhancedError;
  }
}

export async function mutateData({
  method,
  url,
  data,
  signal,
  timeout = 15000,
}) {
  try {
    // Check network connection first
    await checkNetworkConnection();

    const baseUrl = process.env.API_URL || url;
    const Url = new URL(baseUrl);

    // Create abort controller for timeout if one wasn't passed
    let abortController;
    let timeoutId;

    if (!signal) {
      abortController = new AbortController();
      signal = abortController.signal;

      // Set timeout
      timeoutId = setTimeout(() => {
        abortController.abort();
      }, timeout);
    }

    const options = {
      method: method, // 'POST', 'PUT', or 'DELETE'
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers here
      },
      signal,
    };

    // Only add body for POST and PUT requests
    if (method !== "DELETE" && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(Url.toString(), options);

    // Clear timeout if we set it
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    // Some DELETE operations might not return data
    if (method === "DELETE") {
      return { success: true, status: response.status };
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(`Error ${method} data:`, error);

    const formattedError = formatNetworkError(error);
    const enhancedError = new Error(formattedError.message);
    enhancedError.type = formattedError.type;
    enhancedError.originalError = error;

    throw enhancedError;
  }
}
