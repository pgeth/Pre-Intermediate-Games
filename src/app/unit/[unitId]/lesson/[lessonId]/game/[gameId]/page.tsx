import { notFound } from "next/navigation";
import { getUnit, getLesson } from "@/lib/data";
import { FlashcardsGame } from "@/components/games/shared/FlashcardsGame";
import { FillTheGapGame } from "@/components/games/shared/FillTheGapGame";
import { TellAboutQuizGame } from "@/components/games/shared/TellAboutQuizGame";
import { VocabChoiceGame } from "@/components/games/shared/VocabChoiceGame";
import { RiskyBusinessDragTextGame } from "@/components/games/shared/RiskyBusinessDragTextGame";
import type { Lesson } from "@/types/units";

interface Props {
  params: Promise<{ unitId: string; lessonId: string; gameId: string }>;
}

const GAME_COMPONENTS: Record<string, React.ComponentType<{ lesson: Lesson; unitId: string }>> = {
  flashcards: FlashcardsGame,
  "fill-the-gap": FillTheGapGame,
  "tell-about": TellAboutQuizGame,
  "vocab-quiz": VocabChoiceGame,
  "risky-text": RiskyBusinessDragTextGame,
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
