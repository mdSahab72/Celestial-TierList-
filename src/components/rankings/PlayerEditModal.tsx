import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
  onSave: (updatedPlayer: any) => void;
}

export function PlayerEditModal({ isOpen, onClose, player, onSave }: PlayerEditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        region: player.region || '',
        points: player.points || 0,
        tiers: player.tiers ? player.tiers.join(', ') : '',
        role: player.role || '',
        subtier: player.subtier || '',
        tier: player.tier || 1,
      });
    }
  }, [player]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const updatedTiers = typeof formData.tiers === 'string' 
      ? formData.tiers.split(',').map((t: string) => t.trim()).filter(Boolean)
      : formData.tiers;

    await onSave({ 
      ...player, 
      ...formData, 
      tiers: updatedTiers,
      points: Number(formData.points),
      tier: Number(formData.tier)
    });
    
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#151619]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Edit Player: {player?.name}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Region</label>
              <input type="text" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Points</label>
              <input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tiers (comma separated)</label>
              <input type="text" value={formData.tiers} onChange={(e) => setFormData({...formData, tiers: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Role</label>
              <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
