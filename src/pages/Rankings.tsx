import { useState, useEffect } from 'react';
import { Search, Info, Filter, Plus, Shield, Trash2 } from 'lucide-react';
import { cn } from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { categories, mockPlayers as initialMockPlayers, categoryPlayers as initialCategoryPlayers } from '../data/players';
import { InfoModal } from '../components/rankings/InfoModal';
import { PlayerTable } from '../components/rankings/PlayerTable';
import { TierGrid } from '../components/rankings/TierGrid';
import { AddPlayerModal } from '../components/rankings/AddPlayerModal';
import { AdminLoginModal } from '../components/AdminLoginModal';
import { Toast, ToastType } from '../components/Toast';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

export default function Rankings() {
  const [activeCategory, setActiveCategory] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<{player: any, category: string} | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: ToastType, isVisible: boolean}>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const [mockPlayers, setMockPlayers] = useState<any[]>([]);
  const [categoryPlayers, setCategoryPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && (user.email === 'spookysponsersship@gmail.com' || user.email === 'mdsahab727g@gmail.com')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubPlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ensure uniqueness by ID
      const uniquePlayers = Array.from(new Map(playersData.map(p => [p.id, p])).values());
      
      // Sort by points descending to calculate rank
      uniquePlayers.sort((a: any, b: any) => b.points - a.points);
      
      // Assign ranks
      const rankedPlayers = uniquePlayers.map((p, index) => ({
        ...p,
        rank: index + 1
      }));
      
      setMockPlayers(rankedPlayers);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching players:", error);
      setIsLoading(false);
    });

    const unsubCategoryPlayers = onSnapshot(collection(db, 'categoryPlayers'), (snapshot) => {
      const catPlayersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ensure uniqueness by ID
      const uniqueCatPlayers = Array.from(new Map(catPlayersData.map(p => [p.id, p])).values());
      setCategoryPlayers(uniqueCatPlayers);
    }, (error) => {
      console.error("Error fetching category players:", error);
    });

    return () => {
      unsubPlayers();
      unsubCategoryPlayers();
    };
  }, []);

  const handleAdminToggle = async () => {
    if (isAdmin) {
      await signOut(auth);
      setIsAdmin(false);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // One-time initialization of mock data if database is empty
  useEffect(() => {
    const initializeData = async () => {
      const playersSnap = await getDocs(collection(db, 'players'));
      const catPlayersSnap = await getDocs(collection(db, 'categoryPlayers'));
      
      if (playersSnap.empty || catPlayersSnap.empty) {
        const batch = writeBatch(db);
        
        if (playersSnap.empty) {
          initialMockPlayers.forEach(p => {
            const docRef = doc(collection(db, 'players'));
            batch.set(docRef, {
              name: p.name,
              region: p.region,
              points: p.points,
              tiers: p.tiers || [],
              role: p.role
            });
          });
        }

        if (catPlayersSnap.empty) {
          initialCategoryPlayers.forEach(p => {
            const docRef = doc(collection(db, 'categoryPlayers'));
            batch.set(docRef, {
              category: p.category,
              tier: p.tier,
              name: p.name,
              region: p.region
            });
          });
        }

        await batch.commit();
      }
    };
    
    initializeData().catch(console.error);
  }, []);

  const regions = ['All', 'AS/AU', 'AS/EU', 'NA'];

  const handleSavePlayer = async (playerData: any, isEditing: boolean, originalId?: string, originalCategory?: string) => {
    try {
      if (isEditing) {
        if (originalCategory !== playerData.category) {
          // Category changed - delete from old, add to new
          if (originalCategory === 'overall') {
            if (originalId) {
              await deleteDoc(doc(db, 'players', originalId));
            }
          } else {
            if (originalId) {
              await deleteDoc(doc(db, 'categoryPlayers', originalId));
            }
          }
          
          // Add to new category
          if (playerData.category === 'overall') {
            await setDoc(doc(collection(db, 'players')), {
              name: playerData.name,
              role: playerData.role,
              region: playerData.region,
              points: playerData.points,
              tiers: playerData.tiers || []
            });
          } else {
            await setDoc(doc(collection(db, 'categoryPlayers')), {
              category: playerData.category,
              tier: playerData.tier,
              subtier: playerData.subtier || '',
              name: playerData.name,
              region: playerData.region
            });
          }
        } else {
          // Update in same category using ID
          if (playerData.category === 'overall') {
            if (originalId) {
              await setDoc(doc(db, 'players', originalId), {
                name: playerData.name,
                role: playerData.role,
                region: playerData.region,
                points: playerData.points,
                tiers: playerData.tiers || []
              }, { merge: true });
            }
          } else {
            if (originalId) {
              await setDoc(doc(db, 'categoryPlayers', originalId), {
                category: playerData.category,
                tier: playerData.tier,
                subtier: playerData.subtier || '',
                name: playerData.name,
                region: playerData.region
              }, { merge: true });
            }
          }
        }
      } else {
        // Add new player
        if (playerData.category === 'overall') {
          await setDoc(doc(collection(db, 'players')), {
            name: playerData.name,
            role: playerData.role,
            region: playerData.region,
            points: playerData.points,
            tiers: []
          });
        } else {
          await setDoc(doc(collection(db, 'categoryPlayers')), {
            category: playerData.category,
            tier: playerData.tier,
            subtier: playerData.subtier || '',
            name: playerData.name,
            region: playerData.region
          });
        }
      }
      showToast(isEditing ? 'Player updated successfully!' : 'Player added successfully!');
    } catch (error) {
      console.error("Error saving player:", error);
      showToast('Error saving player. Please check your permissions.', 'error');
    }
  };

  const openEditModal = (player: any, category: string) => {
    setEditingPlayer({ ...player, category });
    setIsAddPlayerOpen(true);
  };

  const handleDeletePlayer = (player: any, category: string) => {
    setPlayerToDelete({ player, category });
  };

  const confirmDelete = async () => {
    if (!playerToDelete) return;
    
    const { player, category } = playerToDelete;
    
    try {
      if (category === 'overall') {
        if (player.id) {
          await deleteDoc(doc(db, 'players', player.id));
        }
      } else {
        if (player.id) {
          await deleteDoc(doc(db, 'categoryPlayers', player.id));
        }
      }
      setPlayerToDelete(null);
      showToast('Player deleted successfully!');
    } catch (error) {
      console.error("Error deleting player:", error);
      showToast('Error deleting player. Please check your permissions.', 'error');
      setPlayerToDelete(null);
    }
  };

  const filteredOverallPlayers = mockPlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = activeRegion === 'All' || p.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  const filteredCategoryPlayers = categoryPlayers.filter(p => {
    const matchesCategory = p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = activeRegion === 'All' || p.region === activeRegion;
    return matchesCategory && matchesSearch && matchesRegion;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 font-display">
          Rankings
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          The official leaderboard for top players across all categories.
        </p>
      </motion.div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-[#151619]/60 p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search players..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500 shadow-inner"
            />
          </div>
          
          <div className="relative group w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start gap-2 px-6 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all cursor-pointer font-medium shadow-inner">
              <Filter className="w-4 h-4 text-purple-400" />
              <span className="tracking-wide">{activeRegion}</span>
            </div>
            <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-40 bg-[#151619] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden backdrop-blur-xl">
              {regions.map(region => (
                <div 
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={cn(
                    "px-5 py-3 text-sm cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-2",
                    activeRegion === region ? "text-purple-400 font-bold bg-purple-500/10" : "text-gray-300"
                  )}
                >
                  {activeRegion === region && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  {region}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          <button 
            onClick={handleAdminToggle}
            className={cn(
              "flex items-center gap-2 px-6 py-3 border rounded-2xl text-sm font-bold transition-all shadow-lg",
              isAdmin 
                ? "bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30" 
                : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            )}
            title="Toggle Admin Mode"
          >
            <Shield className={cn("w-4 h-4", isAdmin ? "text-purple-400" : "")} />
            <span className="hidden sm:inline tracking-wide">Admin</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => {
                setEditingPlayer(null);
                setIsAddPlayerOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 border border-purple-400/50 rounded-2xl text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline tracking-wide">Add Player</span>
            </button>
          )}

          <button 
            onClick={() => setIsInfoOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm font-bold text-gray-300 hover:text-white hover:border-white/20 transition-all shadow-lg"
          >
            <Info className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline tracking-wide">Info</span>
          </button>
        </div>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <AnimatePresence>
        <AdminLoginModal 
          isOpen={isAdminModalOpen} 
          onClose={() => setIsAdminModalOpen(false)} 
          onSuccess={() => setIsAdmin(true)} 
        />
        {isInfoOpen && <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />}
        {isAddPlayerOpen && (
          <AddPlayerModal 
            isOpen={isAddPlayerOpen} 
            onClose={() => {
              setIsAddPlayerOpen(false);
              setEditingPlayer(null);
            }} 
            onSavePlayer={handleSavePlayer} 
            initialData={editingPlayer}
          />
        )}
        
        {playerToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1b1e] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                <p className="text-gray-400">
                  Are you sure you want to delete <span className="text-white font-bold">{playerToDelete.player.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full mt-4">
                  <button 
                    onClick={() => setPlayerToDelete(null)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap justify-center gap-3 mb-12 bg-[#151619]/80 p-2 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-xl">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden group",
                isActive 
                  ? `text-white shadow-[0_0_30px_rgba(0,0,0,0.3)] scale-105` 
                  : "text-gray-400 hover:text-white hover:bg-white/5 hover:scale-105"
              )}
            >
              {isActive && (
                <div className={cn("absolute inset-0 opacity-100 bg-gradient-to-r", cat.bg.replace('bg-', 'from-').replace('/20', '/80'), cat.bg.replace('bg-', 'to-').replace('/20', '/40'))} />
              )}
              <span className="relative z-10 flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : cat.color)} />
                <span className="tracking-wide">{cat.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeCategory === 'overall' ? (
            <motion.div
              key="overall"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <PlayerTable 
                players={filteredOverallPlayers} 
                searchQuery={searchQuery} 
                isAdmin={isAdmin} 
                onEditPlayer={(p) => openEditModal(p, 'overall')} 
                onSaveInline={(player, originalId) => handleSavePlayer(player, true, originalId, 'overall')}
                onDeletePlayer={(p) => handleDeletePlayer(p, 'overall')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TierGrid 
                players={filteredCategoryPlayers} 
                activeCategory={activeCategory} 
                searchQuery={searchQuery} 
                isAdmin={isAdmin}
                onEditPlayer={(p) => openEditModal(p, activeCategory)}
                onSaveInline={(player, originalId) => handleSavePlayer(player, true, originalId, activeCategory)}
                onDeletePlayer={(p) => handleDeletePlayer(p, activeCategory)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
