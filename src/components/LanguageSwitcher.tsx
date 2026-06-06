"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { Globe } from "./icons";

export default function LanguageSwitcher() {
  const { script, setScript } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white p-0.5 text-sm font-medium shadow-sm">
      <Globe className="ml-1.5 h-4 w-4 text-ink-400" />
      <button
        type="button"
        onClick={() => setScript("lat")}
        aria-pressed={script === "lat"}
        className={`rounded-full px-2.5 py-1 transition ${
          script === "lat"
            ? "bg-brand-600 text-white shadow-sm"
            : "text-ink-500 hover:text-ink-800"
        }`}
      >
        Lotin
      </button>
      <button
        type="button"
        onClick={() => setScript("cyr")}
        aria-pressed={script === "cyr"}
        className={`rounded-full px-2.5 py-1 transition ${
          script === "cyr"
            ? "bg-brand-600 text-white shadow-sm"
            : "text-ink-500 hover:text-ink-800"
        }`}
      >
        Кирилл
      </button>
    </div>
  );
}
