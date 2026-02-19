"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RuSpoiler } from "@/components/ui/RuSpoiler";
import type { IrregularVerb } from "@/data/irregularVerbsTable1";
import { irregularVerbsTable1 } from "@/data/irregularVerbsTable1";

type CollectionId = "table1" | "table2";

const COLLECTIONS: { id: CollectionId; label: string; verbs: IrregularVerb[] }[] = [
  { id: "table1", label: "Table One", verbs: irregularVerbsTable1 },
  { id: "table2", label: "Table Two", verbs: [] },
];

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function IrregularVerbsFlashcards() {
  const [collectionId, setCollectionId] = useState<CollectionId>("table1");
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<IrregularVerb[] | null>(null);
  const [gordonVoice, setGordonVoice] = useState<SpeechSynthesisVoice | null>(null);
  const pendingIndexRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechAbortRef = useRef<(() => void) | null>(null);
  const speechDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = () => {
      const gordon = window.speechSynthesis.getVoices().find((v) => v.name.includes("Gordon"));
      setGordonVoice(gordon ?? null);
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const collection = COLLECTIONS.find((c) => c.id === collectionId)!;
  const list = collection.verbs.length ? collection.verbs : [];

  const displayList = shuffledDeck && shuffledDeck.length === list.length
    ? shuffledDeck
    : list;

  useEffect(() => {
    setShuffledDeck(null);
    setIndex(0);
  }, [collectionId]);

  useEffect(() => () => {
    if (pendingIndexRef.current) clearTimeout(pendingIndexRef.current);
  }, []);

  const handleShuffle = useCallback(() => {
    setShuffledDeck(shuffleArray(list));
    setIndex(0);
    setShowBack(false);
    setShowTranslation(false);
  }, [list]);

  const current = displayList[index];
  const hasCards = displayList.length > 0;
  const canPrev = index > 0;
  const canNext = index < displayList.length - 1;

  const cancelSpeech = useCallback(() => {
    if (speechDelayRef.current) clearTimeout(speechDelayRef.current);
    speechDelayRef.current = null;
    window.speechSynthesis?.cancel();
  }, []);

  const handleFlip = () => {
    cancelSpeech();
    setShowBack((b) => !b);
    if (!showBack) setShowTranslation(false);
  };

  const handleShowTranslation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(true);
  };

  const SPEAK_DELAY_MS = 550;

  const speakVerbForms = useCallback((verb: IrregularVerb) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speechDelayRef.current) clearTimeout(speechDelayRef.current);
    const texts = [verb.v1, verb.v2, verb.v3];
    let i = 0;
    const speakNext = () => {
      if (i >= texts.length) {
        speechAbortRef.current = null;
        return;
      }
      const u = new SpeechSynthesisUtterance(texts[i]);
      u.lang = "en-GB";
      u.rate = 0.9;
      if (gordonVoice) u.voice = gordonVoice;
      u.onend = () => {
        i++;
        speechDelayRef.current = setTimeout(speakNext, SPEAK_DELAY_MS);
      };
      u.onerror = () => {
        i++;
        speechDelayRef.current = setTimeout(speakNext, SPEAK_DELAY_MS);
      };
      speechAbortRef.current = () => {
        if (speechDelayRef.current) clearTimeout(speechDelayRef.current);
        speechDelayRef.current = null;
        window.speechSynthesis.cancel();
      };
      window.speechSynthesis.speak(u);
    };
    speakNext();
  }, [gordonVoice]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (current) speakVerbForms(current);
  };

  useEffect(() => {
    return () => {
      cancelSpeech();
      speechAbortRef.current = null;
    };
  }, [cancelSpeech]);

  const FLIP_DURATION_MS = 500;

  const goPrev = () => {
    cancelSpeech();
    const nextIndex = Math.max(0, index - 1);
    if (showBack) {
      if (pendingIndexRef.current) clearTimeout(pendingIndexRef.current);
      setShowBack(false);
      setShowTranslation(false);
      pendingIndexRef.current = setTimeout(() => {
        pendingIndexRef.current = null;
        setIndex(nextIndex);
      }, FLIP_DURATION_MS);
      return;
    }
    setIndex(nextIndex);
    setShowBack(false);
    setShowTranslation(false);
  };

  const goNext = () => {
    cancelSpeech();
    const nextIndex = Math.min(displayList.length - 1, index + 1);
    if (showBack) {
      if (pendingIndexRef.current) clearTimeout(pendingIndexRef.current);
      setShowBack(false);
      setShowTranslation(false);
      pendingIndexRef.current = setTimeout(() => {
        pendingIndexRef.current = null;
        setIndex(nextIndex);
      }, FLIP_DURATION_MS);
      return;
    }
    setIndex(nextIndex);
    setShowBack(false);
    setShowTranslation(false);
  };

  return (
    <section className="mb-10">
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Collection selector */}
          <div className="flex flex-wrap gap-2">
            {COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCollectionId(c.id);
                  setIndex(0);
                  setShowBack(false);
                  setShowTranslation(false);
                }}
                disabled={c.verbs.length === 0}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  collectionId === c.id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : c.verbs.length
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-slate-50 text-slate-400 cursor-not-allowed"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {!hasCards && (
            <p className="text-sm text-slate-500 py-4">
              This collection is empty. / <RuSpoiler>В этой коллекции пока нет глаголов.</RuSpoiler>
            </p>
          )}

          {hasCards && (
            <>
              <div className="flex items-center justify-between text-sm text-slate-600 flex-wrap gap-2">
                <span>
                  Card {index + 1} / {displayList.length}
                </span>
                <button
                  type="button"
                  onClick={handleShuffle}
                  disabled={!hasCards}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  title="Shuffle deck"
                >
                  Shuffle
                </button>
              </div>

              <div className="flex items-stretch gap-2 mt-2 min-h-[200px]">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!canPrev}
                  className="flex-shrink-0 w-[78px] min-h-[200px] rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-500 hover:text-slate-700 transition touch-manipulation"
                  aria-label="Previous card"
                >
                  <span className="text-xl font-medium">←</span>
                </button>
                <div
                  className="flex-1 min-w-0 min-h-[200px] perspective-1000 cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={handleFlip}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleFlip(); } }}
                aria-label={showBack ? "Flip card to show verb" : "Flip card to show answer"}
              >
                <div
                  className="relative w-full h-full min-h-[200px] transition-transform duration-500 ease-in-out"
                  style={{ transformStyle: "preserve-3d", transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  {/* Front: verb in main slot, subtle translation link below */}
                  <div
                    className="absolute inset-0 w-full min-h-[200px] p-8 rounded-2xl border-l-4 border-emerald-400 bg-gradient-to-br from-white to-emerald-50/40 shadow-[0_8px_24px_rgba(16,185,129,0.12),0_2px_8px_rgba(0,0,0,0.06)] backface-hidden flex flex-col items-center justify-center text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {current && (
                      <>
                        <p className="text-3xl font-bold text-slate-800 tracking-tight min-h-[2.5rem] flex items-center justify-center">{current.v1}</p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleShowTranslation(e); }}
                          className="mt-5 text-xs text-slate-400 hover:text-slate-600 underline-offset-2 transition"
                        >
                          <RuSpoiler>Показать перевод</RuSpoiler>
                        </button>
                        {showTranslation && (
                          <p className="mt-1 text-slate-500 text-sm"><RuSpoiler>{current.ru}</RuSpoiler></p>
                        )}
                        <span className="mt-5 text-slate-200 text-xl animate-pulse" aria-hidden>↻</span>
                      </>
                    )}
                  </div>
                  {/* Back: V2 and V3 in same size/position as V1 */}
                  <div
                    className="absolute inset-0 w-full min-h-[200px] p-8 rounded-2xl border-l-4 border-emerald-500 bg-gradient-to-br from-white to-emerald-50/50 shadow-[0_8px_24px_rgba(16,185,129,0.12),0_2px_8px_rgba(0,0,0,0.06)] backface-hidden flex flex-col items-center justify-center text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    {current && (
                      <>
                        <div className="text-3xl font-bold text-slate-800 tracking-tight min-h-[2.5rem] flex flex-col items-center justify-center gap-0.5">
                          <span>{current.v2}</span>
                          <span>{current.v3}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSpeak}
                          className="mt-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition touch-manipulation"
                          aria-label="Listen to all three forms"
                          title="Listen (V1, V2, V3)"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        {showTranslation && (
                          <p className="text-slate-500 text-sm mt-2"><RuSpoiler>{current.ru}</RuSpoiler></p>
                        )}
                        <span className="mt-4 text-slate-200 text-xl" aria-hidden>↻</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={goNext}
                disabled={!canNext}
                className="flex-shrink-0 w-[78px] min-h-[200px] rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-500 hover:text-slate-700 transition touch-manipulation"
                aria-label="Next card"
              >
                <span className="text-xl font-medium">→</span>
              </button>
            </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
