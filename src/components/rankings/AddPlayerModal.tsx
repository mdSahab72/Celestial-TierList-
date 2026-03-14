import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../Layout';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlayer: (player: any, isEditing: boolean, originalId?: string, originalCategory?: string) => void;
  initialData?: any;
}

export function AddPlayerModal({ isOpen, onClose, onSavePlayer, initialData }: AddPlayerModalProps) {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'overall',
    tier: 1,
    subtier: '',
    region: 'AS/AU',
    role: 'Member',
    points: 0,
    tiers: [] as string[],
  });

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        category: initialData.category || 'overall',
        tier: initialData.tier || 1,
        subtier: initialData.subtier || '',
        region: initialData.region || 'AS/AU',
        role: initialData.role || 'Member',
        points: initialData.points || 0,
        tiers: initialData.tiers || [],
      });
    } else {
      setFormData({
        id: '',
        name: '',
        category: 'overall',
        tier: 1,
        subtier: '',
        region: 'AS/AU',
        role: 'Member',
        points: 0,
        tiers: [],
      });
    }
    setShowConfirm(false);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    onSavePlayer(formData, isEditing, initialData?.id, initialData?.category);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#151619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {showConfirm ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isEditing ? 'Confirm Changes' : 'Confirm Addition'}
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to {isEditing ? 'save these changes' : 'add this player'} for <span className="text-white font-bold">{formData.name}</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSave}
                className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {isEditing ? <Edit2 className="w-6 h-6 text-purple-400" /> : <Plus className="w-6 h-6 text-purple-400" />}
                {isEditing ? 'Edit Player' : 'Add Player'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Player Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Minecraft Username"
                />
              </div>

              <div className={cn("grid gap-4", formData.category !== 'overall' ? "grid-cols-2" : "grid-cols-1")}>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                  >
                    <option value="overall">Overall</option>
                    <option value="smp">SMP</option>
                    <option value="uhc">UHC</option>
                    <option value="sword">Sword</option>
                    <option value="pot">Pot</option>
                    <option value="axe">Axe</option>
                    <option value="netherite">Netherite</option>
                    <option value="crystal">Crystal</option>
                    <option value="mace">Mace</option>
                  </select>
                </div>
                
                {formData.category !== 'overall' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tier</label>
                    <select 
                      value={formData.tier}
                      onChange={e => setFormData({...formData, tier: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                    >
                      {[1, 2, 3, 4, 5].map(t => (
                        <option key={t} value={t}>Tier {t}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {formData.category !== 'overall' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Subtier (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.subtier}
                    onChange={e => setFormData({...formData, subtier: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="e.g. High, Low, Mid"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Region</label>
                <select 
                  value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                >
                  <option value="AS/AU">AS/AU</option>
                  <option value="AS/EU">AS/EU</option>
                  <option value="NA">NA</option>
                </select>
              </div>

              {formData.category === 'overall' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="e.g. Member"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Points</label>
                    <input 
                      type="number" 
                      value={formData.points}
                      onChange={e => setFormData({...formData, points: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tiers</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tiers.map((tier, index) => (
                        <span key={index} className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-sm border border-purple-500/30">
                          {tier}
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, tiers: formData.tiers.filter((_, i) => i !== index)})}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !formData.tiers.includes(value)) {
                            setFormData({...formData, tiers: [...formData.tiers, value]});
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Type tier and press Enter"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
                >
                  {isEditing ? 'Update Player Info' : 'Add Player'}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
