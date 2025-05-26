"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { getCookie, setCookie } from "cookies-next";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Import translation resources
import enCommon from "../../../public/locales/en/common.json";
import arCommon from "../../../public/locales/ar/common.json";

// Create a context for language state
export const LanguageContext = createContext();

// Define resources outside the component
const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
  },
};

// Initialize i18next with resources
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const [isRTL, setIsRTL] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize from cookie or default to English
    const savedLocale = getCookie("NEXT_LOCALE") || "en";
    setLocale(savedLocale);
    setIsRTL(savedLocale === "ar");
    setInitialized(true);

    // Set the document direction
    document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLocale;

    // Add a special class for RTL styles if needed
    if (savedLocale === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }

    // Update i18n language
    if (i18n.isInitialized) {
      i18n.changeLanguage(savedLocale);
    }
  }, []);

  const changeLanguage = (newLocale) => {
    console.log(`Changing language to: ${newLocale}`);

    // Only change if different from current locale and initialized
    if (newLocale === locale || !initialized) return;

    // Set cookie with long expiration
    setCookie("NEXT_LOCALE", newLocale, {
      maxAge: 31536000, // 1 year
      path: "/",
      sameSite: "strict",
    });

    // Update state
    setLocale(newLocale);
    setIsRTL(newLocale === "ar");

    // Change the document direction
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;

    // Update RTL class
    if (newLocale === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }

    // Change i18next language
    if (i18n.isInitialized) {
      i18n.changeLanguage(newLocale);
    }

    // Force reload the current page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Format function for translation with variables
  const t = (key, options = {}) => {
    const parts = key.split(".");
    let current = resources[locale]?.common;

    // Traverse through the parts to find the value
    for (const part of parts) {
      if (!current || typeof current !== "object") return key;
      current = current[part];
      if (current === undefined) return key;
    }

    // If the value is a string, format variables
    if (typeof current === "string") {
      // Replace variables like {{year}} with values from options
      return current.replace(/\{\{(\w+)\}\}/g, (_, variable) => {
        return options[variable] !== undefined
          ? options[variable]
          : `{{${variable}}}`;
      });
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ locale, isRTL, changeLanguage, t }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
