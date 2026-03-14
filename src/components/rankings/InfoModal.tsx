import { Info } from 'lucide-react';
import { motion } from 'motion/react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#151619] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-purple-400" />
          Ranking Info
        </h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-300">Grades According To Your Points ⬇️</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="font-bold text-yellow-400">Combat Grandmaster</span>
              <span className="font-mono text-sm">300+ Points</span>
            </li>
            <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="font-bold text-purple-400">Combat Master</span>
              <span className="font-mono text-sm">150+ Points</span>
            </li>
            <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="font-bold text-pink-400">Combat Ace</span>
              <span className="font-mono text-sm">90+ Points</span>
            </li>
            <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="font-bold text-emerald-400">Combat Novice</span>
              <span className="font-mono text-sm">50+ Points</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
