import Link from "next/link";
import { getUnitsData } from "@/lib/data";
import { LabelWithRu } from "@/components/ui/LabelWithRu";
import { RuSpoiler } from "@/components/ui/RuSpoiler";

export default async function HomePage() {
  const data = await getUnitsData();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <LabelWithRu
          en="Pre-Intermediate Games"
          ru="Игры для уровня Pre-Intermediate"
          as="h1"
          className="text-3xl font-bold mb-2 text-slate-800"
        />
        <p className="text-slate-600 text-sm">
          <span>Pick a unit and lesson — play together as a warm-up!</span>
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Выберите юнит и урок — играйте вместе на разминке.</RuSpoiler>
        </p>
      </div>
      <Link
        href="/irregular-verbs"
        className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200/50 hover:bg-emerald-500/20 transition"
      >
        <span className="text-2xl" aria-hidden>🃏</span>
        <div className="text-left">
          <span className="font-semibold text-slate-800 block">Irregular verbs — flip cards</span>
          <RuSpoiler className="text-xs text-gray-500 block mt-0.5">Неправильные глаголы — переворачивающиеся карточки (V1 → V2, V3)</RuSpoiler>
        </div>
        <span className="ml-auto text-emerald-600 font-medium">→</span>
      </Link>
      <ul className="space-y-4">
        {data.units.map((unit) => (
          <li key={unit.id}>
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/50 shadow-lg overflow-hidden">
              <div className="px-5 py-3 bg-indigo-500/10 border-b border-indigo-200/30">
                <span className="font-semibold text-slate-800">Unit {unit.unit}. {unit.title}</span>
                <RuSpoiler className="block text-xs text-gray-500">Юнит {unit.unit}. {unit.titleRu ?? unit.title}</RuSpoiler>
              </div>
              <ul className="p-3 space-y-1">
                {unit.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/unit/${unit.id}/lesson/${lesson.id}`}
                      className="block px-4 py-3 rounded-xl text-indigo-600 hover:bg-indigo-50 font-medium transition"
                    >
                      <span>{lesson.id} {lesson.title}</span>
                      <RuSpoiler className="block text-xs text-gray-500">{lesson.id} {lesson.titleRu ?? lesson.title}</RuSpoiler>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
