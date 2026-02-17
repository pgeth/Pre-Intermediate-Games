import { notFound } from "next/navigation";
import { getUnit, getLesson } from "@/lib/data";
import { FlashcardsGame } from "@/components/games/shared/FlashcardsGame";
import { FillTheGapGame } from "@/components/games/shared/FillTheGapGame";
import type { Lesson } from "@/types/units";

interface Props {
  params: Promise<{ unitId: string; lessonId: string; gameId: string }>;
}

const GAME_COMPONENTS: Record<string, React.ComponentType<{ lesson: Lesson; unitId: string }>> = {
  flashcards: FlashcardsGame,
  "fill-the-gap": FillTheGapGame,
};

export default async function GamePage({ params }: Props) {
  const { unitId, lessonId, gameId } = await params;
  const unit = await getUnit(unitId);
  const lesson = await getLesson(unitId, lessonId);
  if (!unit || !lesson) notFound();

  const gameConfig = unit.games.find((g) => g.id === gameId);
  const GameComponent = gameConfig ? GAME_COMPONENTS[gameId] : null;
  if (!GameComponent) notFound();

  return <GameComponent lesson={lesson} unitId={unitId} />;
}
