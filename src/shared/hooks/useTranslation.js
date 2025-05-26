"use client";
import { useTranslation as useNextTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";

export const useTranslation = () => {
  const { t, i18n } = useNextTranslation("common");
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Get the language from cookie or i18n and ensure it's a string
    const cookieLang = getCookie("NEXT_LOCALE");
    const lang = (i18n?.language || cookieLang || "en").toString();
    setCurrentLang(lang);
  }, [i18n?.language]);

  const changeLanguage = useCallback(
    (lang) => {
      console.log(`useTranslation hook: Changing language to ${lang}`);
      setCookie("NEXT_LOCALE", lang, {
        maxAge: 31536000, // 1 year
        path: "/",
        sameSite: "strict",
      });

      if (i18n) {
        i18n.changeLanguage(lang);
      }

      setCurrentLang(lang);

      // Reload the current page without changing URL
      // Use a slight delay to ensure cookie is set
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    [i18n]
  );

  const dir = currentLang === "ar" ? "rtl" : "ltr";

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: currentLang,
    dir,
    isRTL: dir === "rtl",
  };
};
