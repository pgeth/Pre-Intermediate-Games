"use client";

import { usePathname } from "next/navigation";
import { ShowTranslationsProvider } from "@/contexts/ShowTranslationsContext";
import { TranslationToggle } from "@/components/ui/TranslationToggle";

export function LayoutWithTranslations({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTranslationToggle = pathname?.startsWith("/irregular-verbs") ?? false;

  return (
    <ShowTranslationsProvider>
      {!hideTranslationToggle && <TranslationToggle />}
      {children}
    </ShowTranslationsProvider>
  );
}
