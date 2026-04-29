import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Library as LibraryIcon, Plus, Trash2, Search, X, Heart } from 'lucide-react';
import { useWords } from './hooks/useWords';
import { Mascot } from './components/Mascot';
import { Flashcard } from './components/Flashcard';
import { Word } from './types/word';

type Page = 'study' | 'library' | 'wrong';

export default function App() {
  const { words, addWords, updateWordStats, deleteWord, loading } = useWords();
  const [currentPage, setCurrentPage] = useState<Page>('study');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [studyIndex, setStudyIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const studyWords = useMemo(() => {
    // Randomize or prioritize words for study
    return [...words].sort(() => Math.random() - 0.5);
  }, [words, currentPage === 'study']);

  const wrongWords = useMemo(() => {
    return words.filter(w => w.wrongCount > 0).sort((a, b) => b.wrongCount - a.wrongCount);
  }, [words]);

  const filteredWords = useMemo(() => {
    return words.filter(w => 
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.translation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [words, searchQuery]);

  const handleAnswer = (correct: boolean) => {
    const word = studyWords[studyIndex];
    if (word) {
      updateWordStats(word.id, correct);
      setStudyIndex((prev) => (prev + 1) % studyWords.length);
    }
  };

  const handleImport = () => {
    const lines = importText.split('\n').filter(l => l.includes(':') || l.includes(' '));
    const newWords = lines.map(line => {
      const parts = line.split(/[:\s]+/).filter(Boolean);
      return { word: parts[0], translation: parts.slice(1).join(' ') };
    });
    if (newWords.length > 0) {
      addWords(newWords);
      setImportText('');
      setIsImportOpen(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative pb-24 overflow-x-hidden">
      
      {/* Header */}
      <header className="p-6 pt-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-berry-pink tracking-tight">BerryWord</h1>
          <p className="text-sm font-bold text-gray-400">莓莓背单词 ✨</p>
        </div>
        <div className="w-12 h-12 bg-macaron-yellow rounded-2xl flex items-center justify-center shadow-sm">
          <span className="text-xl">🍓</span>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'study' && (
            <motion.div 
              key="study"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center gap-8"
            >
              <Mascot 
                type="rabbit" 
                mood="happy" 
                message={studyWords.length > 0 ? "You can do it! Fight fight! 🐰" : "Add some words to start! ✨"} 
              />
              {studyWords.length > 0 ? (
                <Flashcard 
                  word={studyWords[studyIndex]} 
                  onAnswer={handleAnswer} 
                />
              ) : (
                <div className="text-center p-12 bg-white rounded-3xl border-dashed border-4 border-macaron-pink">
                   <p className="text-gray-400 font-bold italic">No words found in your library...</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                  Progress: {studyIndex + 1} / {studyWords.length}
                </p>
              </div>
            </motion.div>
          )}

          {currentPage === 'library' && (
            <motion.div 
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search words..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 shadow-sm border-none focus:ring-4 focus:ring-macaron-pink transition-all font-bold text-sm"
                  />
                </div>
                <button 
                  onClick={() => setIsImportOpen(true)}
                  className="w-12 h-12 bg-berry-pink rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                >
                  <Plus />
                </button>
              </div>

              {filteredWords.length > 0 ? (
                <div className="grid gap-3">
                  {filteredWords.map((w) => (
                    <div key={w.id} className="bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-macaron-blue flex items-center justify-center font-bold text-berry-blue text-xs">
                          {w.word.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-700">{w.word}</p>
                          <p className="text-xs font-bold text-gray-400">{w.translation}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {w.wrongCount > 0 && (
                           <span className="bg-rose-50 text-rose-500 px-2 py-1 rounded-lg text-[10px] font-bold">
                             Errors: {w.wrongCount}
                           </span>
                        )}
                        <button 
                          onClick={() => deleteWord(w.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-rose-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 opacity-30">
                  <LibraryIcon size={64} className="mx-auto mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Your library is empty</p>
                </div>
              )}
            </motion.div>
          )}

          {currentPage === 'wrong' && (
            <motion.div 
              key="wrong"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Mascot type="bear" mood="encouraging" message="Practice makes perfect! Let's conquer these together 🐻💪" />
              
              <div className="bg-rose-50 p-6 rounded-[2.5rem] border-2 border-rose-100">
                <h3 className="text-rose-500 font-bold flex items-center gap-2 mb-4">
                  <Heart size={18} fill="currentColor" /> Missing pieces
                </h3>
                {wrongWords.length > 0 ? (
                  <div className="grid gap-3">
                    {wrongWords.map(w => (
                      <div key={w.id} className="bg-white p-4 rounded-2xl flex items-center justify-between">
                         <div>
                            <p className="font-black text-gray-700">{w.word}</p>
                            <p className="text-xs font-bold text-rose-300">{w.translation}</p>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xs">
                           {w.wrongCount}
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-rose-300 font-bold py-8 italic text-sm">You haven't made any mistakes yet! Amazing!</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white rounded-[2.5rem] py-4 px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-between items-center z-10">
        <button 
          onClick={() => setCurrentPage('study')}
          className={`flex flex-col items-center gap-1 transition-all ${currentPage === 'study' ? 'text-berry-pink scale-110' : 'text-gray-300'}`}
        >
          <BookOpen strokeWidth={currentPage === 'study' ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest">Study</span>
        </button>
        <button 
          onClick={() => setCurrentPage('library')}
          className={`flex flex-col items-center gap-1 transition-all ${currentPage === 'library' ? 'text-berry-pink scale-110' : 'text-gray-300'}`}
        >
          <LibraryIcon strokeWidth={currentPage === 'library' ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest">Books</span>
        </button>
        <button 
          onClick={() => setCurrentPage('wrong')}
          className={`flex flex-col items-center gap-1 transition-all ${currentPage === 'wrong' ? 'text-berry-pink scale-110' : 'text-gray-300'}`}
        >
          <Trophy strokeWidth={currentPage === 'wrong' ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest">Records</span>
        </button>
      </nav>

      {/* Import Modal */}
      <AnimatePresence>
        {isImportOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-rose-200/50 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-700">Add Words</h2>
                <button onClick={() => setIsImportOpen(false)} className="text-gray-300 hover:text-gray-500">
                  <X />
                </button>
              </div>
              <p className="text-sm font-bold text-gray-400 bg-macaron-yellow/50 p-4 rounded-2xl italic leading-relaxed">
                Enter words in format:<br/>"word: translation" or "word translation"<br/>One per line!
              </p>
              <textarea 
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Example:Apple 苹果"
                className="w-full h-48 bg-gray-50 rounded-3xl p-6 border-none focus:ring-4 focus:ring-macaron-pink transition-all font-bold text-gray-600"
              />
              <button 
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full cute-btn bg-berry-pink text-white disabled:opacity-50"
              >
                Let's Add! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

