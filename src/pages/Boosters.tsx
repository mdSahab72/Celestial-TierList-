import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Zap, Crown, Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../components/Layout';
import { AddBoosterModal } from '../components/boosters/AddBoosterModal';
import { AdminLoginModal } from '../components/AdminLoginModal';
import { Toast, ToastType } from '../components/Toast';
import { motion, AnimatePresence } from 'motion/react';

const initialMockBoosters: any[] = [];

export default function Boosters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAddBoosterOpen, setIsAddBoosterOpen] = useState(false);
  const [editingBooster, setEditingBooster] = useState<any>(null);
  const [boosterToDelete, setBoosterToDelete] = useState<any>(null);
  const [mockBoosters, setMockBoosters] = useState(initialMockBoosters);
  const [toast, setToast] = useState<{message: string, type: ToastType, isVisible: boolean}>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
  }, [isAdmin]);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleSaveBooster = (boosterData: any, isEditing: boolean, originalName?: string) => {
    if (isEditing) {
      setMockBoosters(prev => prev.map(b => b.name === originalName ? { ...b, ...boosterData } : b));
      showToast('Booster updated successfully!');
    } else {
      setMockBoosters(prev => [...prev, boosterData]);
      showToast('Booster added successfully!');
    }
  };

  const handleDeleteBooster = (booster: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setBoosterToDelete(booster);
  };

  const confirmDelete = () => {
    if (boosterToDelete) {
      setMockBoosters(prev => prev.filter(b => b.name !== boosterToDelete.name));
      setBoosterToDelete(null);
      showToast('Booster deleted successfully!');
    }
  };

  const openEditModal = (booster: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBooster(booster);
    setIsAddBoosterOpen(true);
  };

  const filteredBoosters = mockBoosters.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Zap className="w-12 h-12 text-yellow-400" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Boosters
        </h1>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <AnimatePresence>
        {boosterToDelete && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setBoosterToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#151619] border border-white/10 rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Booster?</h2>
              <p className="text-gray-400 mb-8">
                Are you sure you want to delete <span className="text-white font-bold">{boosterToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setBoosterToDelete(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search boosters..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAdminToggle}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border rounded-full text-sm font-medium transition-colors",
              isAdmin 
                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" 
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
            )}
            title="Toggle Admin Mode"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => {
                setEditingBooster(null);
                setIsAddBoosterOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 border border-yellow-400/50 rounded-full text-sm text-black font-bold transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Booster</span>
            </button>
          )}

          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors font-medium">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <AdminLoginModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onSuccess={() => setIsAdmin(true)} 
      />

      <AnimatePresence>
        {isAddBoosterOpen && (
          <AddBoosterModal 
            isOpen={isAddBoosterOpen} 
            onClose={() => {
              setIsAddBoosterOpen(false);
              setEditingBooster(null);
            }} 
            onSaveBooster={handleSaveBooster} 
            initialData={editingBooster}
          />
        )}
      </AnimatePresence>

      {filteredBoosters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {Array.from(new Map(filteredBoosters.map(b => [b.name, b])).values() as any).map((booster: any, idx: number) => (
            <div key={`${booster.name}-${idx}`} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col backdrop-blur-sm hover:bg-white/10 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-yellow-500/20 transition-colors duration-300"></div>
              
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => openEditModal(booster, e)}
                    className="p-2 bg-white/10 hover:bg-yellow-500/20 rounded-xl text-gray-400 hover:text-yellow-400 transition-colors border border-white/10 hover:border-yellow-500/30"
                    title="Edit Booster"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteBooster(booster, e)}
                    className="p-2 bg-white/10 hover:bg-red-500/20 rounded-xl text-gray-400 hover:text-red-400 transition-colors border border-white/10 hover:border-red-500/30"
                    title="Delete Booster"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6 relative z-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 overflow-hidden relative">
                  <img 
                    src={`https://mc-heads.net/body/${booster.name}`} 
                    alt={booster.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${booster.name}&background=random&color=fff`;
                    }}
                  />
                  <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-0.5 shadow-lg shadow-yellow-500/50">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{booster.name}</h3>
                  <div className="text-xs text-yellow-500/70 font-mono font-bold tracking-wider uppercase">{booster.role}</div>
                </div>
              </div>
              
              <div className="flex-1 bg-white/[0.02] rounded-2xl p-4 border border-white/5 relative z-0">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Crown className="w-3 h-3" />
                  Top Gamemodes
                </h4>
                
                {booster.topGamemodes.length > 0 && booster.topGamemodes[0] !== '' ? (
                  <div className="flex flex-col gap-2">
                    {booster.topGamemodes.map((mode: string, i: number) => (
                      <div key={`${mode}-${i}`} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="font-medium text-gray-300">{mode}</span>
                        <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                          {booster.points[i]} points
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <span className="text-sm">No gamemodes yet</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
          <Zap className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No boosters found.</p>
        </div>
      )}
    </div>
  );
}
