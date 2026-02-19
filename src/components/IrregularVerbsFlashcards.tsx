"use client";

import { useState, useMemo } from "react";
import { LabelWithRu } from "@/components/ui/LabelWithRu";
import type { IrregularVerb } from "@/data/irregularVerbsTable1";
import { irregularVerbsTable1 } from "@/data/irregularVerbsTable1";

type CollectionId = "table1" | "table2";

const COLLECTIONS: { id: CollectionId; labelEn: string; labelRu: string; verbs: IrregularVerb[] }[] = [
  { id: "table1", labelEn: "Collection table 1", labelRu: "Коллекция таблицы 1", verbs: irregularVerbsTable1 },
  { id: "table2", labelEn: "Collection table 2", labelRu: "Коллекция таблицы 2", verbs: [] },
];

function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function matchesSearch(verb: IrregularVerb, query: string): boolean {
  if (!query) return true;
  const q = normalizeForSearch(query);
  const v1 = normalizeForSearch(verb.v1);
  const ru = normalizeForSearch(verb.ru);
  return v1.includes(q) || ru.includes(q);
}

export function IrregularVerbsFlashcards() {
  const [collectionId, setCollectionId] = useState<CollectionId>("table1");
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const collection = COLLECTIONS.find((c) => c.id === collectionId)!;
  const filteredVerbs = useMemo(() => {
    const list = collection.verbs.length ? collection.verbs : [];
    if (!search.trim()) return list;
    return list.filter((v) => matchesSearch(v, search));
  }, [collection.verbs, search]);

  const current = filteredVerbs[index];
  const hasCards = filteredVerbs.length > 0;
  const canPrev = index > 0;
  const canNext = index < filteredVerbs.length - 1;

  const handleFlip = () => {
    setShowBack((b) => !b);
    if (!showBack) setShowTranslation(false);
  };

  const handleShowTranslation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(true);
  };

  const goPrev = () => {
    setIndex((i) => Math.max(0, i - 1));
    setShowBack(false);
    setShowTranslation(false);
  };

  const goNext = () => {
    setIndex((i) => Math.min(filteredVerbs.length - 1, i + 1));
    setShowBack(false);
    setShowTranslation(false);
  };

  return (
    <section className="mb-10">
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-200/30">
          <LabelWithRu
            en="Irregular verbs — flip cards"
            ru="Неправильные глаголы — переворачивающиеся карточки"
            as="h2"
            className="text-xl font-semibold text-slate-800"
          />
          <p className="text-sm text-slate-600 mt-1">
            <span>First form (V1) → answer with Past simple (V2) and Past participle (V3).</span>
            <span className="block text-xs text-gray-500 mt-0.5">Даётся первая форма — назовите вторую и третью.</span>
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Collection selector */}
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Collection / Коллекция
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
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
                  {c.labelRu}
                </button>
              ))}
            </div>
          </div>

          {/* Quick search */}
          <div>
            <label htmlFor="verb-search" className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Search / Поиск (English or Russian)
            </label>
            <input
              id="verb-search"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIndex(0);
                setShowBack(false);
                setShowTranslation(false);
              }}
              placeholder="e.g. go, идти..."
              className="mt-1.5 w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400"
            />
          </div>

          {!hasCards && (
            <p className="text-sm text-slate-500 py-4">
              {search
                ? "No verbs match the search. / По вашему запросу ничего не найдено."
                : "This collection is empty. / В этой коллекции пока нет глаголов."}
            </p>
          )}

          {hasCards && (
            <>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>
                  Card {index + 1} / {filteredVerbs.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFlip}
                className="w-full min-h-[200px] p-6 rounded-2xl border-2 border-emerald-200/50 bg-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              >
                {current && (
                  <>
                    {!showBack ? (
                      <>
                        <p className="text-2xl font-bold text-slate-800">{current.v1}</p>
                        <p className="text-sm text-slate-500 mt-2">
                          Name Past simple (V2) and Past participle (V3). Flip to check.
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Назовите вторую и третью форму. Переверните, чтобы проверить.</p>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={handleShowTranslation}
                            className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-200 font-medium text-sm transition"
                          >
                            Показать перевод
                          </button>
                          {showTranslation && (
                            <p className="mt-2 text-slate-600 font-medium">{current.ru}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-slate-700">Past simple</p>
                        <p className="text-xl text-emerald-700 font-bold mt-0.5">{current.v2}</p>
                        <p className="text-lg font-semibold text-slate-700 mt-4">Past participle</p>
                        <p className="text-xl text-emerald-700 font-bold mt-0.5">{current.v3}</p>
                        {showTranslation && (
                          <p className="text-slate-600 mt-4 pt-3 border-t border-slate-100">
                            <span className="text-slate-500">Перевод: </span>
                            {current.ru}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-4">Tap to flip back</p>
                      </>
                    )}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
