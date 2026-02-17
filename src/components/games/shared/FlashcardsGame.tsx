"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Lesson } from "@/types/units";
import { LabelWithRu } from "@/components/ui/LabelWithRu";
import { Confetti } from "@/components/ui/Confetti";

interface Props {
  lesson: Lesson;
  unitId: string;
}

const LIMIT_SEC = 4 * 60; // 4 minutes

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function FlashcardsGame({ lesson, unitId }: Props) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [skipped, setSkipped] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(LIMIT_SEC);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const deck = useMemo(() => shuffle(lesson.vocabulary), [lesson.vocabulary]);
  const current = deck[index];
  const finished = index >= deck.length || secondsLeft <= 0;

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  const handleStart = () => setStarted(true);

  const handleFlip = () => setShowBack((b) => !b);

  const handleKnow = useCallback(() => {
    if (index < deck.length) setKnown((k) => [...k, index]);
    setConfettiTrigger((t) => t + 1);
    setShowBack(false);
    setIndex((i) => i + 1);
  }, [index, deck.length]);

  useEffect(() => {
    if (started && !finished && current) {
      console.log("[Flashcards] Card (answer for host):", current.en, "—", current.ru);
    }
  }, [started, finished, index, current]);

  const handleSkip = () => {
    if (index < deck.length) setSkipped((s) => [...s, index]);
    setShowBack(false);
    setIndex((i) => i + 1);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!started) {
    return (
      <main className="max-w-lg mx-auto p-6">
        <Link
          href={`/unit/${unitId}/lesson/${lesson.id}`}
          className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
        >
          <span>← Back to lesson</span>
          <span className="block text-xs text-gray-500 mt-0.5">Назад к уроку</span>
        </Link>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <LabelWithRu en="Flashcards" ru="Карточки" as="h1" className="text-2xl font-bold mb-2 text-slate-800" />
          <p className="text-sm text-slate-600 mb-4">
            <span>See the phrase, then flip to check the translation. Mark &quot;Know&quot; or &quot;Skip&quot;.</span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Смотрите фразу, переверните карточку для перевода. Отметьте «Знаю» или «Пропустить».
            </span>
          </p>
          <p className="text-sm text-slate-500">
            <span>{deck.length} cards · about {Math.ceil(LIMIT_SEC / 60)} min</span>
            <span className="block text-xs text-gray-500 mt-0.5">{deck.length} карточек · около {Math.ceil(LIMIT_SEC / 60)} мин</span>
          </p>
        </div>
        <button
          onClick={handleStart}
          className="w-full py-4 px-4 rounded-2xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 active:scale-[0.98] transition shadow-lg shadow-indigo-500/30"
        >
          <span>Start game</span>
          <span className="block text-xs text-indigo-200 mt-0.5">Начать игру</span>
        </button>
      </main>
    );
  }

  if (finished) {
    const total = deck.length;
    const knownCount = known.length;
    const skippedCount = skipped.length;
    const pct = total ? Math.round((knownCount / total) * 100) : 0;
    return (
      <main className="max-w-lg mx-auto p-6 relative">
        <Confetti trigger={knownCount > 0 ? 1 : 0} />
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-8 text-center">
          <p className="text-4xl mb-2" aria-hidden>
            {pct >= 80 ? "🌟" : pct >= 50 ? "👍" : "📚"}
          </p>
          <LabelWithRu en="Done!" ru="Готово!" as="h1" className="text-2xl font-bold mb-2 text-slate-800" />
          <p className="text-slate-600 text-sm mb-6">
            <span>Great warm-up!</span>
            <span className="block text-xs text-gray-500">Отличная разминка!</span>
          </p>
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-green-600">{knownCount}</span>
              <span className="text-sm text-slate-500">Known</span>
              <span className="block text-xs text-gray-500">Знаете</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-slate-400">{skippedCount}</span>
              <span className="text-sm text-slate-500">Skipped</span>
              <span className="block text-xs text-gray-500">Пропущено</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <Link
            href={`/unit/${unitId}/lesson/${lesson.id}`}
            className="block w-full py-3 px-4 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 text-center shadow-lg"
          >
            <span>Back to lesson</span>
            <span className="block text-xs text-indigo-200 mt-0.5">Назад к уроку</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto p-6 relative">
      <Confetti trigger={confettiTrigger} />
      <div className="flex justify-between items-center text-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">Card {index + 1} / {deck.length}</span>
          <span className="text-xs text-gray-500">Карточка {index + 1} / {deck.length}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="font-mono font-semibold text-indigo-600">{formatTime(secondsLeft)}</span>
          <span className="text-xs text-gray-500">left</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / deck.length) * 100}%` }}
        />
      </div>

      <button
        type="button"
        onClick={handleFlip}
        className="w-full min-h-[220px] p-6 rounded-2xl border-2 border-white bg-white/95 shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] text-left transition-all"
      >
        {current && (
          <>
            <p className="text-xl font-semibold text-slate-800">{showBack ? current.ru : current.en}</p>
            <p className="text-xs text-slate-400 mt-3">
              {showBack ? "Tap to show English" : "Tap to show translation"}
            </p>
            <p className="text-xs text-gray-400">Нажмите, чтобы {showBack ? "показать английский" : "показать перевод"}</p>
          </>
        )}
      </button>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={handleSkip}
          className="flex-1 py-4 px-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 font-medium transition shadow-sm"
        >
          <span>Skip</span>
          <span className="block text-xs text-gray-500 mt-0.5">Пропустить</span>
        </button>
        <button
          type="button"
          onClick={handleKnow}
          className="flex-1 py-4 px-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 active:scale-[0.98] transition shadow-lg shadow-green-500/30"
        >
          <span>Know ✓</span>
          <span className="block text-xs text-green-200 mt-0.5">Знаю</span>
        </button>
      </div>
    </main>
  );
}
