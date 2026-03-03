"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Lesson } from "@/types/units";
import { LabelWithRu } from "@/components/ui/LabelWithRu";
import { RuSpoiler } from "@/components/ui/RuSpoiler";
import { Confetti } from "@/components/ui/Confetti";

interface Props {
  lesson: Lesson;
  unitId: string;
}

interface Question {
  promptRu: string;
  correctEn: string;
  optionsEn: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildQuestions(lesson: Lesson): Question[] {
  const vocab = lesson.vocabulary ?? [];
  if (vocab.length < 4) return [];

  const base = shuffle(vocab);
  const questions: Question[] = [];

  base.forEach((item) => {
    const wrong = shuffle(
      vocab
        .filter((v) => v.en !== item.en)
        .map((v) => v.en)
    ).slice(0, 3);

    if (wrong.length < 3) return;

    const options = shuffle([item.en, ...wrong]);
    questions.push({
      promptRu: item.ru,
      correctEn: item.en,
      optionsEn: options,
    });
  });

  return questions;
}

export function VocabChoiceGame({ lesson, unitId }: Props) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const questions = useMemo(() => buildQuestions(lesson), [lesson]);
  const current = questions[index];
  const finished = questions.length === 0 || index >= questions.length;

  useEffect(() => {
    if (started && !finished && current) {
      console.log("[VocabChoice] Question (answer for host):", current.correctEn);
    }
  }, [started, finished, index, current]);

  const handleAnswer = useCallback(
    (option: string) => {
      if (!current || selected !== null) return;
      setSelected(option);
      const correct = option === current.correctEn;
      if (correct) {
        setScore((s) => s + 1);
        setConfettiTrigger((t) => t + 1);
      }
      setTimeout(() => {
        setSelected(null);
        setIndex((i) => i + 1);
      }, correct ? 800 : 1500);
    },
    [current, selected]
  );

  if (questions.length === 0) {
    return (
      <main className="max-w-lg mx-auto p-6">
        <p className="text-slate-600">
          <span>Not enough vocabulary items for this quiz.</span>
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
            В этом уроке недостаточно слов для викторины.
          </RuSpoiler>
        </p>
        <Link
          href={`/unit/${unitId}/lesson/${lesson.id}`}
          className="mt-4 inline-block text-indigo-600 font-medium"
        >
          ← Back to lesson
        </Link>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="max-w-lg mx-auto p-6">
        <Link
          href={`/unit/${unitId}/lesson/${lesson.id}`}
          className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
        >
          <span>← Back to lesson</span>
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
            Назад к уроку
          </RuSpoiler>
        </Link>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <LabelWithRu
            en="Work vocabulary quiz"
            ru="Викторина по лексике"
            as="h1"
            className="text-2xl font-bold mb-2 text-slate-800"
          />
          <p className="text-sm text-slate-600 mb-4">
            <span>
              You see a Russian word or phrase. Choose the correct English
              translation.
            </span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
              Вы видите слово или фразу по-русски. Выберите правильный
              перевод на английский.
            </RuSpoiler>
          </p>
          <p className="text-sm text-slate-500">
            <span>{questions.length} questions · 3–5 min</span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
              {questions.length} вопросов · 3–5 мин
            </RuSpoiler>
          </p>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="w-full py-4 px-4 rounded-2xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 active:scale-[0.98] transition shadow-lg shadow-indigo-500/30"
        >
          <span>Start game</span>
          <RuSpoiler className="block text-xs text-indigo-200 mt-0.5">
            Начать игру
          </RuSpoiler>
        </button>
      </main>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <main className="max-w-lg mx-auto p-6 relative">
        <Confetti trigger={score > 0 ? 1 : 0} />
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 p-8 text-center">
          <p className="text-4xl mb-2" aria-hidden>
            {pct >= 80 ? "🌟" : pct >= 50 ? "👍" : "📚"}
          </p>
          <LabelWithRu
            en="Done!"
            ru="Готово!"
            as="h1"
            className="text-2xl font-bold mb-2 text-slate-800"
          />
          <p className="text-slate-600 text-sm mb-6">
            <span>
              Score: {score} / {questions.length}
            </span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
              Счёт: {score} из {questions.length}
            </RuSpoiler>
          </p>
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
            <RuSpoiler className="block text-xs text-indigo-200 mt-0.5">
              Назад к уроку
            </RuSpoiler>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto p-6 relative">
      <Confetti trigger={confettiTrigger} />
      <div className="flex justify-between text-sm mb-4">
        <span className="font-medium text-slate-700">
          Question {index + 1} / {questions.length}
        </span>
        <span className="text-slate-500">
          Score: {score}
          <RuSpoiler className="block text-xs text-gray-500">
            Счёт
          </RuSpoiler>
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
          <span>Russian word / phrase</span>
          <RuSpoiler className="block text-xs text-gray-500">
            Слово или фраза по-русски
          </RuSpoiler>
        </p>
        <div className="bg-white/95 rounded-2xl shadow-xl border-2 border-indigo-100 p-5">
          <p className="text-lg text-slate-800 leading-relaxed font-medium">
            {current.promptRu}
          </p>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-600 mb-3">
        <span>Choose the correct English translation.</span>
        <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
          Выберите правильный перевод на английский.
        </RuSpoiler>
      </p>
      <ul className="space-y-3">
        {current.optionsEn.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === current.correctEn;
          const showWrong = selected !== null && isSelected && !isCorrect;
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={selected !== null}
                className={`w-full py-4 px-4 rounded-xl text-left font-medium transition border-2 ${
                  showWrong
                    ? "border-red-300 bg-red-50 text-red-800"
                    : isSelected && isCorrect
                      ? "border-green-400 bg-green-50 text-green-800"
                      : "border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-70"
                }`}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

