import React, { createContext, useContext, useState, useEffect } from "react";
import { so } from "../translations/so.js";
import { en } from "../translations/en.js";
import { ar } from "../translations/ar.js";

const dictionaries = { so, en, ar };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("dhiigkaal_lang") || "so";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("dhiigkaal_lang", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  const setLanguage = (newLang) => {
    if (dictionaries[newLang]) {
      setLanguageState(newLang);
    }
  };

  /**
   * Helper to fetch translated text by dot-notation key (e.g. "nav.home")
   */
  const t = (key, fallback = "") => {
    if (!key) return fallback;
    const dict = dictionaries[language] || dictionaries.so;
    const fallbackDict = dictionaries.so;

    const keys = key.split(".");
    let current = dict;
    let fallbackCurrent = fallbackDict;

    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        current = null;
      }

      if (fallbackCurrent && fallbackCurrent[k] !== undefined) {
        fallbackCurrent = fallbackCurrent[k];
      } else {
        fallbackCurrent = null;
      }
    }

    if (current && typeof current === "string") {
      return current;
    }
    if (fallbackCurrent && typeof fallbackCurrent === "string") {
      return fallbackCurrent;
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
