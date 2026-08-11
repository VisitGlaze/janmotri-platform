import React, { createContext, useContext, useState } from "react";
import { translations } from "./translations";
import { imageConfig } from "./imageConfig";
import { useMediaStore } from "./useMediaStore";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Read initial language from localStorage, default to 'en'
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("janmotri_lang");
    return saved === "gu" || saved === "hi" || saved === "en" ? saved : "en";
  });

  // Read dynamic image mappings from the mediaStore reactively
  const imageMappings = useMediaStore((state) => state.imageMappings);

  const setLanguage = (lang) => {
    if (lang === "en" || lang === "gu" || lang === "hi") {
      localStorage.setItem("janmotri_lang", lang);
      setLanguageState(lang);
    }
  };

  // Safe translation resolver supporting nested key paths (e.g. "home.hero.title")
  const t = (keyPath, defaultValue = "") => {
    const keys = keyPath.split(".");

    // 1. Resolve for active language
    let current = translations[language];
    let resolved = true;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        resolved = false;
        break;
      }
    }

    if (resolved) {
      return current;
    }

    // 2. Fallback to English translation
    let fallback = translations["en"];
    let resolvedFallback = true;
    for (const key of keys) {
      if (fallback && fallback[key] !== undefined) {
        fallback = fallback[key];
      } else {
        resolvedFallback = false;
        break;
      }
    }

    if (resolvedFallback) {
      return fallback;
    }

    // 3. Return default text or the path itself
    return defaultValue || keyPath;
  };

  // Centralized image resolver returning the correct variant based on active language
  const getImage = (key) => {
    if (!key) return "";

    // 1. Check if there is a custom mapped image in mediaStore
    if (imageMappings && imageMappings[key]) {
      return imageMappings[key];
    }

    // 2. Fallback to static config
    const imgData = imageConfig[key];
    if (!imgData) {
      console.warn(`[ImageConfig] Key "${key}" not found in imageConfig.`);
      return "";
    }
    return imgData[language] || imgData["en"] || "";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getImage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};