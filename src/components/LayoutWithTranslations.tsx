"use client";

import { ShowTranslationsProvider } from "@/contexts/ShowTranslationsContext";
import { TranslationToggle } from "@/components/ui/TranslationToggle";

export function LayoutWithTranslations({ children }: { children: React.ReactNode }) {
  return (
    <ShowTranslationsProvider>
      <TranslationToggle />
      {children}
    </ShowTranslationsProvider>
  );
}
