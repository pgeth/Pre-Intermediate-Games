"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import type React from "react";
import Link from "next/link";
import type { Lesson } from "@/types/units";
import { LabelWithRu } from "@/components/ui/LabelWithRu";
import { RuSpoiler } from "@/components/ui/RuSpoiler";
import { Confetti } from "@/components/ui/Confetti";

interface Props {
  lesson: Lesson;
  unitId: string;
}

interface StoryConfig {
  id: string;
  parts: string[];
  answers: string[];
}

const STORIES: StoryConfig[] = [
  {
    id: "dangerous-jobs-1",
    parts: [
      "Some jobs are very dangerous. For example, a ",
      " often travels to dangerous places. A ",
      " sometimes has to ",
      " to save people. In these jobs you usually ",
      " and ",
      " every day. Would you like to be a ",
      ", a ",
      " or a ",
      "?"
    ],
    answers: [
      "foreign correspondent",
      "rescue worker",
      "risk lives",
      "work under pressure",
      "work in a team",
      "sales rep",
      "fashion designer",
      "TV presenter"
    ]
  },
  {
    id: "dangerous-jobs-2",
    parts: [
      "Many people think dangerous jobs are only for men, but a ",
      " can also ",
      " when there is a problem. A ",
      " often drives fast in the city and has to ",
      ". In these jobs you must ",
      " and ",
      " to stay safe."
    ],
    answers: [
      "rescue worker",
      "risk lives",
      "motorcycle courier",
      "work under pressure",
      "work in a team",
      "to deal with (a problem)"
    ]
  },
  {
    id: "active-jobs",
    parts: [
      "Some jobs are exciting and active, not only risky. A ",
      " helps people get fit. A ",
      " works on television. A ",
      " and a ",
      " both have to ",
      " and ",
      " on big projects."
    ],
    answers: [
      "personal trainer",
      "TV presenter",
      "sales rep",
      "fashion designer",
      "work under pressure",
      "work in a team"
    ]
  }
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function RiskyBusinessDragTextGame({ lesson, unitId }: Props) {
  const story = useMemo(
    () => STORIES[Math.floor(Math.random() * STORIES.length)],
    []
  );
  const [started, setStarted] = useState(false);
  const [assigned, setAssigned] = useState<(number | null)[]>(
    () => Array(story.answers.length).fill(null)
  );
  const [selectedBankIndex, setSelectedBankIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const bank = useMemo(
    () => shuffle(story.answers.map((w, i) => ({ id: i, label: w }))),
    [story.answers]
  );

  useEffect(() => {
    console.log("[Risky business text] Story id:", story.id);
    console.log("[Risky business text] Correct answers (in order):", story.answers);
  }, [story]);

  const allFilled = assigned.every((i) => i !== null);

  const handleDropOnGap = useCallback(
    (gapIndex: number, bankIndex: number) => {
      setAssigned((prev) => {
        const next = [...prev];
        next[gapIndex] = bankIndex;
        return next;
      });
      setSelectedBankIndex(null);
      setChecked(false);
    },
    []
  );

  const handleBankClick = (index: number) => {
    setSelectedBankIndex((current) => (current === index ? null : index));
  };

  const handleGapClick = (gapIndex: number) => {
    if (selectedBankIndex !== null) {
      handleDropOnGap(gapIndex, selectedBankIndex);
      return;
    }
    // Clear on click if nothing selected
    setAssigned((prev) => {
      const next = [...prev];
      next[gapIndex] = null;
      return next;
    });
    setChecked(false);
  };

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, index: number) => {
    event.dataTransfer.setData("text/plain", String(index));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>, gapIndex: number) => {
    event.preventDefault();
    const indexStr = event.dataTransfer.getData("text/plain");
    const bankIndex = Number.parseInt(indexStr, 10);
    if (Number.isNaN(bankIndex)) return;
    handleDropOnGap(gapIndex, bankIndex);
  };

  const handleCheck = () => {
    if (!allFilled) return;
    setChecked(true);
    const correctCount = assigned.reduce((acc, bankIndex, gapIndex) => {
      if (bankIndex === null) return acc;
      const word = bank[bankIndex]?.label;
      return word === story.answers[gapIndex] ? acc + 1 : acc;
    }, 0);
    if (correctCount === story.answers.length) {
      setConfettiTrigger((t) => t + 1);
    }
  };

  const correctCount = checked
    ? assigned.reduce((acc, bankIndex, gapIndex) => {
        if (bankIndex === null) return acc;
        const word = bank[bankIndex]?.label;
        return word === story.answers[gapIndex] ? acc + 1 : acc;
      }, 0)
    : 0;

  if (!started) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <Link
          href={`/unit/${unitId}/lesson/${lesson.id}`}
          className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
        >
          <span>← Back to lesson</span>
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Назад к уроку</RuSpoiler>
        </Link>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <LabelWithRu
            en="A risky business — story"
            ru="Рискованный бизнес — история"
            as="h1"
            className="text-2xl font-bold mb-2 text-slate-800"
          />
          <p className="text-sm text-slate-600 mb-4">
            <span>Drag the words to complete the story about dangerous jobs.</span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
              Перетаскивайте слова, чтобы заполнить пропуски в тексте про опасные профессии.
            </RuSpoiler>
          </p>
          <p className="text-sm text-slate-500">
            <span>8 gaps · 5–7 min</span>
            <RuSpoiler className="block text-xs text-gray-500 mt-0.5">
              8 пропусков · 5–7 минут
            </RuSpoiler>
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

  return (
    <main className="max-w-2xl mx-auto p-6 relative">
      <Confetti trigger={confettiTrigger} />

      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          <span>Word bank</span>
          <RuSpoiler className="block text-xs text-gray-500">Слова для вставки</RuSpoiler>
        </p>
        <div className="flex flex-wrap gap-2">
          {bank.map((item, index) => {
            const isUsed = assigned.includes(index);
            const isSelected = selectedBankIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                draggable={!isUsed}
                onDragStart={(event) => handleDragStart(event, index)}
                onClick={() => !isUsed && handleBankClick(index)}
                className={`px-3 py-1.5 rounded-full text-sm border transition shadow-sm ${
                  isUsed
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-default"
                    : isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-indigo-200 bg-white text-slate-800 hover:bg-indigo-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <span>Drag a word into a gap or click a word and then click a gap.</span>
          <RuSpoiler className="block text-xs text-gray-500">
            Перетащите слово в пропуск или нажмите на слово, а затем на пропуск.
          </RuSpoiler>
        </p>
      </div>

      <div className="bg-white/95 rounded-2xl shadow-xl border-2 border-white p-6 leading-relaxed text-slate-800 mb-6">
        {story.parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < story.answers.length && (
              <button
                type="button"
                onClick={() => handleGapClick(idx)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, idx)}
                className={`inline-flex min-w-[90px] px-2 py-1 mx-0.5 rounded-md border-b-2 border-dashed align-baseline text-sm ${
                  assigned[idx] !== null
                    ? "border-indigo-400 bg-indigo-50 font-semibold text-indigo-800"
                    : "border-slate-300 bg-slate-50 text-slate-400"
                }`}
              >
                {assigned[idx] !== null ? bank[assigned[idx] as number]?.label : "______"}
              </button>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={!allFilled}
          className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-md hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>Check answers</span>
          <RuSpoiler className="block text-[10px] text-green-100 mt-0.5">Проверить ответы</RuSpoiler>
        </button>
        {checked && (
          <p className="text-sm text-slate-700">
            <span>
              Correct: {correctCount} / {story.answers.length}
            </span>
            <RuSpoiler className="block text-xs text-gray-500">
              Правильно: {correctCount} из {story.answers.length}
            </RuSpoiler>
          </p>
        )}
      </div>
    </main>
  );
}

