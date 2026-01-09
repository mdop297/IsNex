export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizContent {
  questions: Question[];
}

export interface FlashcardGeneratedContent {
  flashcards: Flashcard[];
}

export type GeneratedContent = QuizContent | FlashcardGeneratedContent;
