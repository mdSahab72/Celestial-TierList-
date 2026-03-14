import React, { useState } from 'react';
import { cn } from '../Layout';
import { motion } from 'motion/react';
import { Edit2, Trash2, Check, X, Crown } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TierGridProps {
  players: any[];
  activeCategory: string;
  searchQuery: string;
  isAdmin?: boolean;
  onEditPlayer?: (player: any) => void;
  onSaveInline?: (player: any, originalId: string) => void;
  onDeletePlayer?: (player: any) => void;
  onReorderPlayers?: (players: any[]) => void;
}

const getCategoryGradient = (catId: string) => {
  switch(catId) {
    case 'smp': return 'from-green-500/20 to-emerald-500/20';
    case 'uhc': return 'from-yellow-500/20 to-amber-500/20';
    case 'sword': return 'from-blue-500/20 to-cyan-500/20';
    case 'pot': return 'from-orange-500/20 to-red-500/20';
    case 'axe': return 'from-emerald-500/20 to-green-500/20';
    case 'netherite': return 'from-red-500/20 to-orange-500/20';
    case 'crystal': return 'from-pink-500/20 to-rose-500/20';
    default: return 'from-purple-500/20 to-pink-500/20';
  }
};

function SortablePlayer({ player, i, activeCategory, editingId, editForm, setEditForm, confirmId, isAdmin, onEditPlayer, onSaveInline, onDeletePlayer, startEdit, handleSaveClick, confirmSave, cancelEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id, disabled: !isAdmin });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...(isAdmin ? { ...attributes, ...listeners } : {})}>
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        key={player.id ? `tier-player-${player.id}-${i}` : `tier-player-${player.name}-${i}`} 
        className={cn(
          "flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5",
          isAdmin ? "cursor-grab" : ""
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-8">
            {i < 3 && <Crown className={cn("w-4 h-4 mb-0.5", i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-amber-600")} />}
            <span className={cn(
              "text-xs font-bold",
              i === 0 ? "text-yellow-400" : 
              i === 1 ? "text-gray-300" : 
              i === 2 ? "text-amber-600" : "text-gray-500"
            )}>#{i + 1}</span>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br border border-white/10 overflow-hidden shadow-lg shrink-0",
            getCategoryGradient(activeCategory)
          )}>
            <img 
              src={`https://mc-heads.net/body/${player.name}`} 
              alt={player.name} 
              className="w-full h-full object-contain" 
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=random&color=fff`;
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors flex items-center gap-2 flex-wrap">
              <span className="truncate">{player.name}</span>
              {editingId === player.id ? (
                <div className="flex items-center gap-1">
                  <select
                    value={editForm.tier}
                    onChange={(e) => setEditForm({ ...editForm, tier: Number(e.target.value) })}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] bg-white/10 border border-white/20 rounded px-1 py-0.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5].map(t => (
                      <option key={t} value={t}>T{t}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editForm.subtier}
                    onChange={(e) => setEditForm({ ...editForm, subtier: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Subtier"
                    className="text-[10px] bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white focus:outline-none focus:border-purple-500 w-16"
                  />
                </div>
              ) : (
                player.subtier && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 border border-white/5 text-gray-300 font-medium leading-none tracking-wide">
                    {player.subtier}
                  </span>
                )
              )}
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{player.region}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <div className="flex items-center gap-1">
              {confirmId === player.id ? (
                <>
                  <button 
                    onClick={(e) => confirmSave(e, player)}
                    className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors border border-green-500/30"
                    title="Confirm Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={cancelEdit}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors border border-red-500/30"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : editingId === player.id ? (
                <>
                  <button 
                    onClick={(e) => handleSaveClick(e, player)}
                    className="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-colors border border-purple-500/30"
                    title="Save Changes"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={cancelEdit}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors border border-white/10"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={(e) => startEdit(e, player)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors border border-white/5 opacity-40 group-hover:opacity-100"
                    title="Quick Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPlayer?.(player);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-purple-400 transition-colors border border-white/5 opacity-40 group-hover:opacity-100"
                    title="Full Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlayer?.(player);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors border border-white/5 opacity-40 group-hover:opacity-100 hover:border-red-500/30"
                    title="Delete Player"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function TierGrid({ players, activeCategory, searchQuery, isAdmin, onEditPlayer, onSaveInline, onDeletePlayer, onReorderPlayers }: TierGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any, tier: number) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const playersInTier = players.filter(p => p.tier === tier);
      const oldIndex = playersInTier.findIndex(p => p.id === active.id);
      const newIndex = playersInTier.findIndex(p => p.id === over.id);
      const newPlayersInTier = arrayMove(playersInTier, oldIndex, newIndex);
      
      // Update the order for all players
      const newPlayers = [...players];
      // This is a bit tricky, we need to maintain the order of other tiers
      // A better way is to update the order property of players if it exists, 
      // but here we just reorder within the tier.
      // Assuming players have an order property or we just reorder them in the array.
      // Since we don't have order property, let's just assume we can reorder them.
      
      // Actually, for now, let's just call onReorderPlayers with the new list of all players
      // with the reordered players in this tier.
      const playersNotInTier = players.filter(p => p.tier !== tier);
      onReorderPlayers?.([...playersNotInTier, ...newPlayersInTier]);
    }
  };

  const startEdit = (e: React.MouseEvent, player: any) => {
    e.stopPropagation();
    setEditingId(player.id);
    setEditForm({
      tier: player.tier,
      subtier: player.subtier || '',
    });
    setConfirmId(null);
  };

  const handleSaveClick = (e: React.MouseEvent, player: any) => {
    e.stopPropagation();
    setConfirmId(player.id);
  };

  const confirmSave = (e: React.MouseEvent, player: any) => {
    e.stopPropagation();
    if (onSaveInline) {
      onSaveInline({ ...player, ...editForm }, player.id);
    }
    setEditingId(null);
    setConfirmId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setConfirmId(null);
  };

  if (players.length === 0 && searchQuery) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm text-center text-gray-400 py-12"
      >
        No players found matching "{searchQuery}" in this category
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
    >
      {[1, 2, 3, 4, 5].map((tier) => {
        const playersInTier = players.filter(p => p.tier === tier);
        
        if (searchQuery && playersInTier.length === 0) return null;

        return (
          <motion.div 
            key={tier} 
            layout
            className={cn(
              "bg-[#151619]/60 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col",
              tier === 4 ? "md:col-span-2 lg:col-span-1" : "",
              tier === 5 ? "md:col-span-2 lg:col-span-2" : ""
            )}
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <Tooltip text={
                  tier === 1 ? "Elite players, top-tier performance" :
                  tier === 2 ? "High-performing players" :
                  tier === 3 ? "Solid, consistent players" :
                  tier === 4 ? "Developing players with potential" :
                  "Entry-level players"
                }>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg shadow-inner cursor-help",
                    tier === 1 ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    tier === 2 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                    tier === 3 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                    tier === 4 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                    "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  )}>
                    {tier}
                  </div>
                </Tooltip>
                <h3 className="font-bold text-lg text-white tracking-wide">Tier {tier}</h3>
              </div>
              <span className="text-xs text-gray-500 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {playersInTier.length}
              </span>
            </div>
            <div className="p-3 flex-1">
              {playersInTier.length > 0 ? (
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={(event) => handleDragEnd(event, tier)}
                >
                  <SortableContext items={playersInTier.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                      {playersInTier.map((p, i) => (
                        <SortablePlayer 
                          key={p.id} 
                          player={p} 
                          i={i} 
                          activeCategory={activeCategory} 
                          editingId={editingId} 
                          editForm={editForm} 
                          setEditForm={setEditForm} 
                          confirmId={confirmId} 
                          isAdmin={isAdmin} 
                          onEditPlayer={onEditPlayer} 
                          onSaveInline={onSaveInline} 
                          onDeletePlayer={onDeletePlayer} 
                          startEdit={startEdit} 
                          handleSaveClick={handleSaveClick} 
                          confirmSave={confirmSave} 
                          cancelEdit={cancelEdit} 
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 py-8 text-sm font-medium">No players</div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
