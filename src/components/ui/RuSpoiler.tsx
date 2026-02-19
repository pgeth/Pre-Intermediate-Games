"use client";

import { useShowTranslations } from "@/contexts/ShowTranslationsContext";

interface RuSpoilerProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}

/** Русский текст: при выключенных переводах показывается как «туманчик» (спойлер), при включённых — как обычно. */
export function RuSpoiler({ children, className = "", as: Tag = "span" }: RuSpoilerProps) {
  const { showTranslations } = useShowTranslations();
  return (
    <Tag
      className={`${showTranslations ? "translation-spoiler-visible" : "translation-spoiler"} ${className}`}
      aria-hidden={!showTranslations}
    >
      {children}
    </Tag>
  );
}
