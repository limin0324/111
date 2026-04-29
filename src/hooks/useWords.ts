import { useState, useEffect } from 'react';
import { Word } from '../types/word';

const STORAGE_KEY = 'berryword_data';

export const useWords = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse words', e);
      }
    } else {
      // Default initial words
      const initials: Word[] = [
        { id: '1', word: 'Berry', translation: '莓果', reviewCount: 0, wrongCount: 0 },
        { id: '2', word: 'Rabbit', translation: '兔子', reviewCount: 0, wrongCount: 0 },
        { id: '3', word: 'Cloud', translation: '云朵', reviewCount: 0, wrongCount: 0 },
      ];
      setWords(initials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initials));
    }
    setLoading(false);
  }, []);

  const saveWords = (newWords: Word[]) => {
    setWords(newWords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWords));
  };

  const addWords = (list: { word: string; translation: string }[]) => {
    const newEntries: Word[] = list.map(item => ({
      id: crypto.randomUUID(),
      word: item.word,
      translation: item.translation,
      reviewCount: 0,
      wrongCount: 0
    }));
    saveWords([...words, ...newEntries]);
  };

  const updateWordStats = (id: string, correct: boolean) => {
    const updated = words.map(w => {
      if (w.id === id) {
        return {
          ...w,
          reviewCount: w.reviewCount + 1,
          wrongCount: correct ? w.wrongCount : w.wrongCount + 1,
          lastStudied: Date.now()
        };
      }
      return w;
    });
    saveWords(updated);
  };

  const deleteWord = (id: string) => {
    saveWords(words.filter(w => w.id !== id));
  };

  return { words, addWords, updateWordStats, deleteWord, loading };
};
