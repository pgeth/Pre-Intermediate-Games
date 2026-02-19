"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ShowTranslationsContextValue = {
  showTranslations: boolean;
  toggleTranslations: () => void;
};

const ShowTranslationsContext = createContext<ShowTranslationsContextValue | null>(null);

export function useShowTranslations(): ShowTranslationsContextValue {
  const ctx = useContext(ShowTranslationsContext);
  if (!ctx) throw new Error("useShowTranslations must be used within ShowTranslationsProvider");
  return ctx;
}

export function ShowTranslationsProvider({ children }: { children: ReactNode }) {
  const [showTranslations, setShowTranslations] = useState(false);
  const toggleTranslations = useCallback(() => setShowTranslations((v) => !v), []);
  return (
    <ShowTranslationsContext.Provider value={{ showTranslations, toggleTranslations }}>
      {children}
    </ShowTranslationsContext.Provider>
  );
}
