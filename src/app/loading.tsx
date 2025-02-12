'use client';
import { useEffect, useState } from 'react';
export default function Loading({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/50 backdrop-blur-xs z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}