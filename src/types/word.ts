export interface Word {
  id: string;
  word: string;
  translation: string;
  category?: string;
  tags?: string[];
  lastStudied?: number;
  reviewCount: number;
  wrongCount: number;
  isFavorite?: boolean;
}

export type StudySessionResult = {
  correct: number;
  wrong: number;
  timeSpent: number;
  wrongWords: string[];
};
