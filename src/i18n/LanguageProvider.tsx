"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Script, type TranslationKey } from "./translations";

type LanguageContextValue = {
  script: Script;
  setScript: (s: Script) => void;
  toggleScript: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "qalamdocs-script";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [script, setScriptState] = useState<Script>("lat");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "lat" || saved === "cyr") {
      setScriptState(saved);
    }
  }, []);

  const setScript = (s: Script) => {
    setScriptState(s);
    window.localStorage.setItem(STORAGE_KEY, s);
    document.documentElement.lang = s === "cyr" ? "uz-Cyrl" : "uz-Latn";
  };

  const toggleScript = () => setScript(script === "lat" ? "cyr" : "lat");

  const t = (key: TranslationKey) => translations[key]?.[script] ?? key;

  return (
    <LanguageContext.Provider value={{ script, setScript, toggleScript, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
