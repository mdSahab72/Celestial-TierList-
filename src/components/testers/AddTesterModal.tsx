import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../Layout';

interface AddTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTester: (tester: any, isEditing: boolean, originalName?: string) => void;
  initialData?: any;
}

export function AddTesterModal({ isOpen, onClose, onSaveTester, initialData }: AddTesterModalProps) {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'TESTER',
    status: 'ACTIVE',
    total: 0,
    monthly: 0,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || 'TESTER',
        status: initialData.status || 'ACTIVE',
        total: initialData.total || 0,
        monthly: initialData.monthly || 0,
      });
    } else {
      setFormData({
        name: '',
        role: 'TESTER',
        status: 'ACTIVE',
        total: 0,
        monthly: 0,
      });
    }
    setShowConfirm(false);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    onSaveTester(formData, isEditing, initialData?.name);
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
        className="relative w-full max-w-md bg-[#151619] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {showConfirm ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <AlertTriangle className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isEditing ? 'Confirm Changes' : 'Confirm Addition'}
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to {isEditing ? 'save these changes' : 'add this tester'} for <span className="text-white font-bold">{formData.name}</span>?
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
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {isEditing ? <Edit2 className="w-6 h-6 text-purple-400" /> : <Plus className="w-6 h-6 text-purple-400" />}
                {isEditing ? 'Edit Tester' : 'Add Tester'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="tester-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Player Name</label>
                  <input 
                    type="text" 
                    required
                    disabled={isEditing}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                      isEditing && "opacity-50 cursor-not-allowed"
                    )}
                    placeholder="Minecraft Username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                    >
                      <option value="HEAD">HEAD</option>
                      <option value="TESTER">TESTER</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                    >
                      <option value="VERY ACTIVE">VERY ACTIVE</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Total Tests</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.total}
                      onChange={e => setFormData({...formData, total: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Tests</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.monthly}
                      onChange={e => setFormData({...formData, monthly: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 shrink-0">
              <button 
                type="submit"
                form="tester-form"
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
              >
                {isEditing ? 'Review Changes' : 'Add Tester'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
