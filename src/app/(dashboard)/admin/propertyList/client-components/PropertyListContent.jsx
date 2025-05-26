"use client";

import { useEffect, useState } from "react";
import PropertyList from "../PropertyList";
import { useProperties } from "@/shared/hooks/useProperties";
import { RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";
import propertyListTranslations from "../translations";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export default function PropertyListContent() {
  const { fetchProperties, properties, loading, error } = useProperties();
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Add translation support
  const { currentLanguage, isRTL } = useTranslation();
  const t =
    propertyListTranslations[currentLanguage] || propertyListTranslations.en;

  useEffect(() => {
    let isMounted = true;
    const loadProperties = async () => {
      try {
        // Fetch all properties with a large page size
        await fetchProperties(0, 100);
        if (isMounted) {
          setIsInitializing(false);
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    loadProperties();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchProperties, retryCount]);

  const handleRetry = () => {
    setIsInitializing(true);
    setRetryCount((prev) => prev + 1);
  };

  if (isInitializing || loading) {
    return (
      <div
        className={`flex justify-center items-center h-[70vh] w-full ${
          isRTL ? "rtl" : ""
        }`}
      >
        <motion.div
          className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-border/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="relative w-16 h-16 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full rounded-full border-t-4 border-primary opacity-75"></div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <motion.h3
              className="text-xl font-semibold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t.loading}
            </motion.h3>
            <motion.p
              className="text-muted-foreground text-center max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t.loadingDescription}
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={`flex justify-center items-center h-64 ${
          isRTL ? "rtl" : ""
        }`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div className="text-center">
          <motion.p
            className="text-destructive text-lg font-medium mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t.failedToLoad}
          </motion.p>
          <motion.p
            className="text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {error}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleRetry}
              className={`px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${
                isRTL ? "rtl-flex-row-reverse" : ""
              }`}
            >
              {t.tryAgain}
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`flex flex-col gap-4 ${isRTL ? "rtl" : ""}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold">{t.propertyList}</h1>
          <LanguageSwitcher />
        </motion.div>
        <motion.div variants={item}>
          <PropertyList properties={properties} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
