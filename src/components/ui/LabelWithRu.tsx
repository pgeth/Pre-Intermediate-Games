"use client";

import { useShowTranslations } from "@/contexts/ShowTranslationsContext";

interface LabelWithRuProps {
  en: string;
  ru: string;
  className?: string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
}

export function LabelWithRu({ en, ru, className = "", as: Tag = "span" }: LabelWithRuProps) {
  const { showTranslations } = useShowTranslations();
  return (
    <Tag className={`block ${className}`}>
      <span>{en}</span>
      <span
        className={`block text-xs text-gray-500 mt-0.5 ${showTranslations ? "translation-spoiler-visible" : "translation-spoiler"}`}
        aria-hidden={!showTranslations}
      >
        {ru}
      </span>
    </Tag>
  );
}
