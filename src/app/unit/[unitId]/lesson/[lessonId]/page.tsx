import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit, getLesson } from "@/lib/data";
import { LabelWithRu } from "@/components/ui/LabelWithRu";
import { RuSpoiler } from "@/components/ui/RuSpoiler";

interface Props {
  params: Promise<{ unitId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { unitId, lessonId } = await params;
  const unit = await getUnit(unitId);
  const lesson = await getLesson(unitId, lessonId);
  if (!unit || !lesson) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
        <span>← Back to units</span>
        <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Назад к юнитам</RuSpoiler>
      </Link>
      <div className="mb-6">
        <LabelWithRu
          en={`Unit ${unit.unit}. ${unit.title} — ${lesson.id} ${lesson.title}`}
          ru={`Юнит ${unit.unit}. ${unit.titleRu ?? unit.title} — ${lesson.id} ${lesson.titleRu ?? lesson.title}`}
          as="h1"
          className="text-xl font-bold mb-1 text-slate-800"
        />
        <p className="text-sm text-slate-600">
          <span>Choose a game (3–5 min)</span>
          <RuSpoiler className="block text-xs text-gray-500 mt-0.5">Выберите игру (3–5 мин)</RuSpoiler>
        </p>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-3">
        <span>Games</span>
        <RuSpoiler className="block text-xs text-gray-500 font-normal mt-0.5">Игры</RuSpoiler>
      </h2>
      <ul className="space-y-3">
        {unit.games.map((game) => (
          <li key={game.id}>
            <Link
              href={`/unit/${unitId}/lesson/${lessonId}/game/${game.id}`}
              className="block p-5 rounded-2xl border-2 border-white bg-white/90 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-800">{game.titleEn}</span>
                  <RuSpoiler className="block text-xs text-gray-500 mt-0.5">{game.titleRu}</RuSpoiler>
                </div>
                <div className="flex gap-0.5" aria-label={`Difficulty: ${game.difficulty} out of 3`}>
                  {[1, 2, 3].map((d) => (
                    <span
                      key={d}
                      className={`text-lg ${d <= game.difficulty ? "text-amber-400" : "text-slate-200"}`}
                      aria-hidden
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
