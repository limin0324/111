import { motion } from 'motion/react';
import { Rabbit, PawPrint, Sparkles } from 'lucide-react';

interface MascotProps {
  type: 'rabbit' | 'bear';
  mood?: 'happy' | 'thinking' | 'encouraging';
  message?: string;
}

export const Mascot = ({ type, mood = 'happy', message }: MascotProps) => {
  const Icon = type === 'rabbit' ? Rabbit : PawPrint;
  const bgColor = type === 'rabbit' ? '#FFDDE2' : '#D0EFFF';
  const accentColor = type === 'rabbit' ? '#FF85A1' : '#4FA3FF';

  return (
    <div className="flex flex-col items-center gap-4 animate-float">
      <div 
        className="relative w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-lg group"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={64} color={accentColor} strokeWidth={1.5} />
        
        {/* Blushing cheeks */}
        <div className="absolute top-[60%] left-6 w-3 h-2 bg-pink-300 rounded-full blur-[1px] opacity-60" />
        <div className="absolute top-[60%] right-6 w-3 h-2 bg-pink-300 rounded-full blur-[1px] opacity-60" />

        {/* Floating stars */}
        <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">
           <Sparkles size={24} fill="currentColor" />
        </div>
      </div>
      
      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white px-6 py-3 rounded-2xl shadow-md relative"
        >
          <p className="text-sm font-bold text-gray-600 line-clamp-2 text-center">{message}</p>
          {/* Bubble tail */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
        </motion.div>
      )}
    </div>
  );
};

