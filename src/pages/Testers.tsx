import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Users, Activity, Calendar, ShieldCheck, Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../components/Layout';
import { AddTesterModal } from '../components/testers/AddTesterModal';
import { AdminLoginModal } from '../components/AdminLoginModal';
import { Toast, ToastType } from '../components/Toast';
import { motion, AnimatePresence } from 'motion/react';

const initialMockTesters = [
  { name: 'GummyBearTheGOAT', role: 'HEAD', status: 'VERY ACTIVE', total: 2, monthly: 0, avatar: 'GummyBearTheGOAT' },
  { name: 'RyuGotSkills', role: 'TESTER', status: 'ACTIVE', total: 0, monthly: 0, avatar: 'RyuGotSkills' },
  { name: 'CurzClaps', role: 'TESTER', status: 'ACTIVE', total: 1, monthly: 0, avatar: 'CurzClaps' },
  { name: 'OrionOp_', role: 'TESTER', status: 'ACTIVE', total: 0, monthly: 0, avatar: 'OrionOp_' },
  { name: 'MrHotLeader', role: 'TESTER', status: 'ACTIVE', total: 0, monthly: 0, avatar: 'MrHotLeader' },
];

export default function Testers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAddTesterOpen, setIsAddTesterOpen] = useState(false);
  const [editingTester, setEditingTester] = useState<any>(null);
  const [testerToDelete, setTesterToDelete] = useState<any>(null);
  const [mockTesters, setMockTesters] = useState(initialMockTesters);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleSaveTester = (testerData: any, isEditing: boolean, originalName?: string) => {
    if (isEditing) {
      setMockTesters(prev => prev.map(t => t.name === originalName ? { ...t, ...testerData, avatar: testerData.name } : t));
      showToast('Tester updated successfully!');
    } else {
      setMockTesters(prev => [...prev, { ...testerData, avatar: testerData.name }]);
      showToast('Tester added successfully!');
    }
  };

  const handleDeleteTester = (tester: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setTesterToDelete(tester);
  };

  const confirmDelete = () => {
    if (testerToDelete) {
      setMockTesters(prev => prev.filter(t => t.name !== testerToDelete.name));
      setTesterToDelete(null);
      showToast('Tester deleted successfully!');
    }
  };

  const openEditModal = (tester: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTester(tester);
    setIsAddTesterOpen(true);
  };

  const filteredTesters = mockTesters.filter(t => 
    (statusFilter === 'All' || t.status === statusFilter) &&
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
      <AnimatePresence>
        {testerToDelete && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setTesterToDelete(null)}
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
              <h2 className="text-2xl font-bold text-white mb-2">Delete Tester?</h2>
              <p className="text-gray-400 mb-8">
                Are you sure you want to delete <span className="text-white font-bold">{testerToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setTesterToDelete(null)}
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

      {/* Header Section */}
      <div className="flex flex-col items-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-xl shadow-purple-500/10">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40">
            Testers
          </h1>
        </div>
        <p className="text-gray-400 text-lg font-medium tracking-wide text-center max-w-2xl relative z-10">
          The elite team ensuring quality and stability across the Celestial network.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-16 w-full max-w-3xl relative z-10">
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight font-mono">{mockTesters.length}</div>
          <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">Total Testers</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-5xl md:text-6xl font-black text-purple-400 mb-2 tracking-tight font-mono">
            {mockTesters.filter(t => t.status.includes('ACTIVE')).length}
          </div>
          <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">Active This Month</div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-2xl">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-5 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search testers by IGN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151619]/80 backdrop-blur-xl border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-xl"
              />
            </div>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#151619]/80 backdrop-blur-xl border border-white/10 rounded-full py-4 px-6 text-gray-300 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-xl"
          >
            <option value="All">All Statuses</option>
            <option value="VERY ACTIVE">Very Active</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleAdminToggle}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-4 border rounded-full text-sm font-medium transition-colors shadow-xl",
              isAdmin 
                ? "bg-purple-500/20 border-purple-500/50 text-purple-400" 
                : "bg-[#151619]/80 backdrop-blur-xl border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            )}
            title="Toggle Admin Mode"
          >
            <Shield className="w-5 h-5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => {
                setEditingTester(null);
                setIsAddTesterOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-purple-500 hover:bg-purple-600 border border-purple-400/50 rounded-full text-sm text-white font-bold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Tester</span>
            </button>
          )}

          <button 
            onClick={handleRefresh}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[#151619]/80 backdrop-blur-xl border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all shadow-xl group"
          >
            <RefreshCw className={cn("w-5 h-5 group-hover:text-purple-400 transition-colors", isRefreshing && "animate-spin text-purple-400")} />
            <span className="font-semibold tracking-wide hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      <AdminLoginModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onSuccess={() => setIsAdmin(true)} 
      />

      <AnimatePresence>
        {isAddTesterOpen && (
          <AddTesterModal 
            isOpen={isAddTesterOpen} 
            onClose={() => {
              setIsAddTesterOpen(false);
              setEditingTester(null);
            }} 
            onSaveTester={handleSaveTester} 
            initialData={editingTester}
          />
        )}
      </AnimatePresence>

      {/* Testers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full relative z-10">
        {Array.from(new Map(filteredTesters.map(t => [t.name, t])).values() as any).map((tester: any, idx: number) => (
          <div 
            key={`${tester.name}-${idx}`} 
            className="group relative bg-[#151619]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex flex-col items-center hover:bg-[#1a1b1e]/80 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)]"
          >
            {isAdmin && (
              <div className="absolute top-6 left-6 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => openEditModal(tester, e)}
                  className="p-2 bg-white/10 hover:bg-purple-500/20 rounded-xl text-gray-400 hover:text-purple-400 transition-colors border border-white/10 hover:border-purple-500/30"
                  title="Edit Tester"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleDeleteTester(tester, e)}
                  className="p-2 bg-white/10 hover:bg-red-500/20 rounded-xl text-gray-400 hover:text-red-400 transition-colors border border-white/10 hover:border-red-500/30"
                  title="Delete Tester"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Role Badge - Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck className={cn("w-3.5 h-3.5", tester.role === 'HEAD' ? 'text-yellow-400' : 'text-gray-400')} />
              <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">{tester.role}</span>
            </div>

            {/* Avatar Section */}
            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-28 h-28 rounded-2xl bg-[#0a0510] border border-white/10 overflow-hidden shadow-2xl">
                <img 
                  src={`https://mc-heads.net/body/${tester.name}`} 
                  alt={tester.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out" 
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${tester.name}&background=random&color=fff`;
                  }}
                />
                <div className={cn(
                  "absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-[3px] border-[#0a0510] shadow-sm",
                  tester.status === 'VERY ACTIVE' ? 'bg-green-500 shadow-green-500/50' :
                  tester.status === 'ACTIVE' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-yellow-400 shadow-yellow-400/50'
                )} />
              </div>
            </div>
            
            {/* Info Section */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors tracking-tight">
              {tester.name}
            </h3>
            
            <div className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-8 border backdrop-blur-md",
              tester.status === 'VERY ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              tester.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            )}>
              {tester.status}
            </div>
            
            {/* Stats Section */}
            <div className="flex w-full gap-3 mt-auto">
              <div className="flex-1 bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                <Activity className="w-4 h-4 text-gray-500 mb-2 group-hover:text-gray-400 transition-colors" />
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total</div>
                <div className="text-xl font-black text-white font-mono">{tester.total}</div>
              </div>
              <div className="flex-1 bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                <Calendar className="w-4 h-4 text-purple-500/70 mb-2 group-hover:text-purple-400 transition-colors" />
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Monthly</div>
                <div className="text-xl font-black text-white font-mono">{tester.monthly}</div>
              </div>
            </div>
          </div>
        ))}

        {filteredTesters.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No testers found</h3>
            <p className="text-gray-400">We couldn't find anyone matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
