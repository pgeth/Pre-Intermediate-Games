"use client";

import { useShowTranslations } from "@/contexts/ShowTranslationsContext";

export function TranslationToggle() {
  const { showTranslations, toggleTranslations } = useShowTranslations();

  return (
    <button
      type="button"
      onClick={toggleTranslations}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 shadow-lg border border-slate-200/80 hover:bg-white font-medium text-slate-700 transition"
      title={showTranslations ? "Скрыть переводы" : "Показать переводы"}
      aria-label={showTranslations ? "Скрыть переводы" : "Показать переводы"}
    >
      <span className="text-lg" aria-hidden>{showTranslations ? "👁️" : "👁️‍🗨️"}</span>
      <span className="text-sm hidden sm:inline">
        {showTranslations ? "Скрыть переводы" : "Показать переводы"}
      </span>
    </button>
  );
}
