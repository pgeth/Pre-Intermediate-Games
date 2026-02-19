import Link from "next/link";
import { IrregularVerbsFlashcards } from "@/components/IrregularVerbsFlashcards";
import { RuSpoiler } from "@/components/ui/RuSpoiler";

export default function IrregularVerbsPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
      >
        <span>← Back to home</span>
        <RuSpoiler className="block text-xs text-gray-500 mt-0.5">← На главную</RuSpoiler>
      </Link>
      <IrregularVerbsFlashcards />
    </main>
  );
}
