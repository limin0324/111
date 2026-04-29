import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Word } from '../types/word';

interface FlashcardProps {
  word: Word;
  onAnswer: (correct: boolean) => void;
}

export const Flashcard = ({ word, onAnswer }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Simple synthesized sound effects
  const playSound = (freq: number, type: OscillatorType = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn('Audio context not allowed yet');
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playSound(440);
  };

  const handleAnswerClick = (e: React.MouseEvent, correct: boolean) => {
    e.stopPropagation();
    playSound(correct ? 880 : 220, correct ? 'sine' : 'square');
    onAnswer(correct);
    setTimeout(() => setIsFlipped(false), 200);
  };

  return (
    <div 
      className="w-full max-w-sm aspect-[3/4] relative [perspective:1000px] cursor-pointer group" 
      onClick={handleFlip}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFlipped ? 'back' : 'front'}
          initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
          className={`w-full h-full rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 text-center border-8 border-white ${
            isFlipped ? 'bg-macaron-blue/30' : 'bg-macaron-pink/30'
          } backdrop-blur-sm relative overflow-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />

          {isFlipped ? (
            <div className="space-y-4 z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-berry-blue opacity-60">Meaning</span>
              <h2 className="text-4xl font-black text-gray-700">{word.translation}</h2>
              <div className="pt-8 flex gap-4">
                <button 
                  onClick={(e) => handleAnswerClick(e, false)}
                  className="bg-white text-rose-400 p-5 rounded-[2rem] shadow-sm hover:scale-110 active:scale-95 transition-transform"
                >
                  <span className="text-2xl">☹️</span>
                </button>
                <button 
                  onClick={(e) => handleAnswerClick(e, true)}
                  className="bg-white text-emerald-400 p-5 rounded-[2rem] shadow-sm hover:scale-110 active:scale-95 transition-transform"
                >
                  <span className="text-2xl">😊</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-berry-pink opacity-60">Word</span>
              <h1 className="text-5xl font-black text-gray-700 break-all leading-tight">{word.word}</h1>
              <div className="mt-8 px-4 py-2 bg-white/40 rounded-full inline-block">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Tap to flip ✨</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

