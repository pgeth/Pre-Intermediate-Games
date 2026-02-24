export interface VocabItem {
  en: string;
  ru: string;
}

/** One correct question (A) and one answer in past tense (B) for "Tell about..." quiz */
export interface QuizTellAboutPair {
  question: string;
  answer: string;
  wrongQuestions: string[];
  /** Russian translation for console/host */
  questionRu?: string;
  answerRu?: string;
}

export interface Lesson {
  id: string;
  lesson: number;
  title: string;
  /** Russian translation of lesson title for UI subtitle */
  titleRu?: string;
  grammar: string;
  vocabulary: VocabItem[];
  prompts: string[];
  adverbs: string[];
  /** Pairs for "Tell about..." quiz (answer B → choose question A). Used by combined lessons. */
  quizTellAboutPairs?: QuizTellAboutPair[];
}

export interface GameConfig {
  id: string;
  type: "2d" | "3d";
  titleEn: string;
  titleRu: string;
  /** 1 = easy, 2 = medium, 3 = hard */
  difficulty: 1 | 2 | 3;
}

export interface Unit {
  id: string;
  unit: number;
  title: string;
  /** Russian translation of unit title for UI subtitle */
  titleRu?: string;
  lessons: Lesson[];
  games: GameConfig[];
}

export interface UnitsData {
  units: Unit[];
}
