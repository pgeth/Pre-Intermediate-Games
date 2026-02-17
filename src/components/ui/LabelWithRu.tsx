interface LabelWithRuProps {
  en: string;
  ru: string;
  className?: string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
}

export function LabelWithRu({ en, ru, className = "", as: Tag = "span" }: LabelWithRuProps) {
  return (
    <Tag className={`block ${className}`}>
      <span>{en}</span>
      <span className="block text-xs text-gray-500 mt-0.5" aria-hidden>
        {ru}
      </span>
    </Tag>
  );
}
