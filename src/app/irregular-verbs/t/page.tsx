"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { IrregularVerb } from "@/data/irregularVerbsTable1";
import { irregularVerbsTable1 } from "@/data/irregularVerbsTable1";

const COLLECTIONS: { id: string; label: string; verbs: IrregularVerb[] }[] = [
  { id: "table1", label: "Table One", verbs: irregularVerbsTable1 },
  { id: "table2", label: "Table Two", verbs: [] },
];

function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function matchesSearch(verb: IrregularVerb, query: string): boolean {
  if (!query.trim()) return true;
  const q = normalizeForSearch(query);
  return (
    normalizeForSearch(verb.v1).includes(q) ||
    normalizeForSearch(verb.v2).includes(q) ||
    normalizeForSearch(verb.v3).includes(q) ||
    normalizeForSearch(verb.ru).includes(q)
  );
}

export default function IrregularVerbsTablePage() {
  const [collectionId, setCollectionId] = useState("table1");
  const [search, setSearch] = useState("");

  const collection = COLLECTIONS.find((c) => c.id === collectionId)!;
  const filteredVerbs = useMemo(() => {
    const list = collection.verbs.length ? collection.verbs : [];
    if (!search.trim()) return list;
    return list.filter((v) => matchesSearch(v, search));
  }, [collection.verbs, search]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link
        href="/irregular-verbs"
        className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
      >
        <span>← Back to cards</span>
        <span className="block text-xs text-gray-500 mt-0.5">← К карточкам</span>
      </Link>

      <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCollectionId(c.id)}
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

          <div>
            <label htmlFor="table-search" className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Search / Поиск (English or Russian)
            </label>
            <input
              id="table-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. go, went, идти..."
              className="mt-1.5 w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400"
            />
          </div>

          {collection.verbs.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              This collection is empty. / В этой коллекции пока нет глаголов.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-2.5 px-3 text-xs font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 border-r border-emerald-200/60">Перевод</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Verb</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Past simple</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Past participle</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerbs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-sm">
                        No verbs match the search. / По вашему запросу ничего не найдено.
                      </td>
                    </tr>
                  ) : (
                    filteredVerbs.map((v) => (
                      <tr key={v.v1} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-emerald-800 bg-emerald-50/70 border-r border-emerald-200/50">{v.ru}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{v.v1}</td>
                        <td className="py-2.5 px-3 text-slate-700">{v.v2}</td>
                        <td className="py-2.5 px-3 text-slate-700">{v.v3}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
