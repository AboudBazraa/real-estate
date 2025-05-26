"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create context for network status
const NetworkContext = createContext({
  isOnline: true,
  offlineSince: null,
});

export const useNetwork = () => useContext(NetworkContext);

export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineSince, setOfflineSince] = useState(null);

  useEffect(() => {
    // Set initial state based on navigator.onLine
    setIsOnline(typeof navigator !== "undefined" && navigator.onLine);

    // Handle online event
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSince(null);
    };

    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(new Date());
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, offlineSince }}>
      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white py-2 px-4 text-center z-50 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>You are offline. Please check your internet connection.</span>
          </div>
        </div>
      )}
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkProvider;
