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

const NUM_QUESTIONS = 8;

type Question =
  | { type: "adverb"; sentenceBefore: string; sentenceAfter: string; correct: string; options: string[] }
  | { type: "phrase"; sentenceBefore: string; sentenceAfter: string; correct: string; options: string[] };

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickRandom<T>(arr: T[], n: number, exclude?: T): T[] {
  const pool = exclude ? arr.filter((x) => x !== exclude) : arr;
  const shuffled = shuffle(pool);
  return shuffled.slice(0, n);
}

function buildQuestions(lesson: Lesson): Question[] {
  const questions: Question[] = [];
  const adverbs = lesson.adverbs ?? [];
  const vocab = lesson.vocabulary ?? [];
  const verbPhrases = vocab.map((v) => v.en).filter((en) => en.startsWith("to ") && !en.includes("to be "));

  // Adverb sentences: "I _____ go on holiday."
  const adverbTemplates = [
    { before: "I ", after: " go on holiday in summer." },
    { before: "She ", after: " goes shopping at weekends." },
    { before: "We ", after: " have a barbecue." },
    { before: "They ", after: " have time off." },
    { before: "He ", after: " plays games." },
    { before: "I ", after: " do exercise." },
  ];
  adverbTemplates.forEach((t) => {
    if (adverbs.length < 2) return;
    const correct = adverbs[Math.floor(Math.random() * adverbs.length)];
    questions.push({
      type: "adverb",
      sentenceBefore: t.before,
      sentenceAfter: t.after,
      correct,
      options: shuffle([...adverbs]),
    });
  });

  // Phrase sentences: "I like _____ ." (options are "to go on holiday" etc. — phrase as-is)
  const phraseTemplates = [
    { before: "I like ", after: "." },
    { before: "They want ", after: "." },
    { before: "She likes ", after: "." },
    { before: "He wants ", after: "." },
  ];
  if (vocab.length >= 4) {
    const used = new Set<string>();
    phraseTemplates.forEach((t) => {
      const available = vocab.map((v) => v.en).filter((en) => !used.has(en));
      if (available.length < 4) return;
      const correctItem = available[Math.floor(Math.random() * available.length)];
      used.add(correctItem);
      const wrong = pickRandom(
        vocab.map((v) => v.en),
        3,
        correctItem
      );
      questions.push({
        type: "phrase",
        sentenceBefore: t.before,
        sentenceAfter: t.after,
        correct: correctItem,
        options: shuffle([correctItem, ...wrong]),
      });
    });
  }

  return shuffle(questions).slice(0, NUM_QUESTIONS);
}

export function FillTheGapGame({ lesson, unitId }: Props) {
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
      const translationRu =
        current.type === "phrase"
          ? lesson.vocabulary.find((v) => v.en === current.correct)?.ru ?? "(no translation)"
          : { usually: "обычно", sometimes: "иногда", often: "часто", never: "никогда" }[current.correct] ?? "";
      console.log("[Fill the gap] Question (answer for host):", current.correct, "—", translationRu);
    }
  }, [started, finished, index, current, lesson.vocabulary]);

  const handleAnswer = useCallback(
    (option: string) => {
      if (selected !== null || !current) return;
      setSelected(option);
      const correct = option === current.correct;
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
          <span>Not enough vocabulary or adverbs in this lesson for Fill the gap.</span>
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">В этом уроке недостаточно слов для игры.</RuSpoiler>
        </p>
        <Link href={`/unit/${unitId}/lesson/${lesson.id}`} className="mt-4 inline-block text-indigo-600 font-medium">
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
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Назад к уроку</RuSpoiler>
        </Link>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <LabelWithRu en="Fill the gap" ru="Вставь слово" as="h1" className="text-2xl font-bold mb-2 text-slate-800" />
          <p className="text-sm text-slate-600 mb-4">
            <span>Choose the correct word or phrase to complete the sentence.</span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Выберите правильное слово или фразу вместо пропуска.</RuSpoiler>
          </p>
          <p className="text-sm text-slate-500">
            <span>{questions.length} questions · 3–5 min</span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">{questions.length} вопросов · 3–5 мин</RuSpoiler>
          </p>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="w-full py-4 px-4 rounded-2xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 active:scale-[0.98] transition shadow-lg shadow-indigo-500/30"
        >
          <span>Start game</span>
          <RuSpoiler className="block text-xs text-indigo-200 mt-0.5">Начать игру</RuSpoiler>
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
          <LabelWithRu en="Done!" ru="Готово!" as="h1" className="text-2xl font-bold mb-2 text-slate-800" />
          <p className="text-slate-600 text-sm mb-6">
            <span>Score: {score} / {questions.length}</span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Счёт: {score} из {questions.length}</RuSpoiler>
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
            <RuSpoiler className="block text-xs text-indigo-200 mt-0.5">Назад к уроку</RuSpoiler>
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
          <RuSpoiler className="block text-xs text-gray-500">Счёт</RuSpoiler>
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white/95 rounded-2xl shadow-xl border-2 border-white p-6 mb-6">
        <p className="text-lg text-slate-800 leading-relaxed">
          {current.sentenceBefore}
          <span className="inline-block min-w-[100px] border-b-2 border-dashed border-indigo-300 mx-1 font-semibold text-indigo-700 align-bottom">
            {selected !== null ? (selected === current.correct ? current.correct : selected + " → " + current.correct) : " ______ "}
          </span>
          {current.sentenceAfter}
        </p>
      </div>

      <ul className="space-y-3">
        {current.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === current.correct;
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
