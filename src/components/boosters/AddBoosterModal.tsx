import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../Layout';

interface AddBoosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBooster: (booster: any, isEditing: boolean, originalName?: string) => void;
  initialData?: any;
}

export function AddBoosterModal({ isOpen, onClose, onSaveBooster, initialData }: AddBoosterModalProps) {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'Booster',
    topGamemodes: [''],
    points: [0],
  });

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || 'Booster',
        topGamemodes: initialData.topGamemodes?.length ? [...initialData.topGamemodes] : [''],
        points: initialData.points?.length ? [...initialData.points] : [0],
      });
    } else {
      setFormData({
        name: '',
        role: 'Booster',
        topGamemodes: [''],
        points: [0],
      });
    }
    setShowConfirm(false);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    onSaveBooster(formData, isEditing, initialData?.name);
    onClose();
  };

  const addGamemode = () => {
    setFormData(prev => ({
      ...prev,
      topGamemodes: [...prev.topGamemodes, ''],
      points: [...prev.points, 0]
    }));
  };

  const removeGamemode = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topGamemodes: prev.topGamemodes.filter((_, i) => i !== index),
      points: prev.points.filter((_, i) => i !== index)
    }));
  };

  const updateGamemode = (index: number, value: string) => {
    setFormData(prev => {
      const newModes = [...prev.topGamemodes];
      newModes[index] = value;
      return { ...prev, topGamemodes: newModes };
    });
  };

  const updatePoints = (index: number, value: number) => {
    setFormData(prev => {
      const newPoints = [...prev.points];
      newPoints[index] = value;
      return { ...prev, points: newPoints };
    });
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
        className="relative w-full max-w-md bg-[#151619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
              Are you sure you want to {isEditing ? 'save these changes' : 'add this booster'} for <span className="text-white font-bold">{formData.name}</span>?
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
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {isEditing ? <Edit2 className="w-6 h-6 text-yellow-400" /> : <Plus className="w-6 h-6 text-yellow-400" />}
                {isEditing ? 'Edit Booster' : 'Add Booster'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="booster-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Player Name</label>
                  <input 
                    type="text" 
                    required
                    disabled={isEditing}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50",
                      isEditing && "opacity-50 cursor-not-allowed"
                    )}
                    placeholder="Minecraft Username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    placeholder="e.g. Server Booster"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-400">Top Gamemodes</label>
                    <button 
                      type="button"
                      onClick={addGamemode}
                      className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-[1fr,80px,40px] gap-2 mb-2 px-1 text-xs font-medium text-gray-500 uppercase">
                    <span>Gamemode</span>
                    <span>Points</span>
                    <span></span>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.topGamemodes.map((mode, index) => (
                      <div key={index} className="grid grid-cols-[1fr,80px,40px] gap-2 items-center">
                        <input 
                          type="text" 
                          required
                          value={mode}
                          onChange={e => updateGamemode(index, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                          placeholder="Gamemode"
                        />
                        <input 
                          type="number" 
                          required
                          value={formData.points[index]}
                          onChange={e => updatePoints(index, Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                          placeholder="Pts"
                        />
                        <div className="flex justify-center">
                          {formData.topGamemodes.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeGamemode(index)}
                              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 shrink-0">
              <button 
                type="submit"
                form="booster-form"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors"
              >
                {isEditing ? 'Review Changes' : 'Add Booster'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
