import React, { useState } from 'react';
import { cn } from '../Layout';
import { motion } from 'motion/react';
import { Edit2, Trash2, Check, X, Settings, Crown, Info } from 'lucide-react';
import { Tooltip } from '../Tooltip';
import { Resizer } from '../Resizer';
import { PlayerEditModal } from './PlayerEditModal';

interface PlayerTableProps {
  players: any[];
  searchQuery: string;
  isAdmin?: boolean;
  onEditPlayer?: (player: any) => void;
  onSaveInline?: (player: any, originalId: string) => void;
  onDeletePlayer?: (player: any) => void;
}

export function PlayerTable({ players, searchQuery, isAdmin, onEditPlayer, onSaveInline, onDeletePlayer }: PlayerTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [columnWidths, setColumnWidths] = useState<number[]>(isAdmin ? [80, 400, 120, 120, 100] : [80, 400, 120, 120]);

  const regions = ['All', ...Array.from(new Set(players.map(p => p.region)))];

  const filteredPlayers = players.filter(p => 
    (regionFilter === 'All' || p.region === regionFilter) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startEdit = (e: React.MouseEvent, player: any) => {
    e.stopPropagation();
    setEditingId(player.id);
    setEditForm({
      role: player.role,
      points: player.points,
      tiers: player.tiers ? player.tiers.join(', ') : '',
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
      const updatedTiers = typeof editForm.tiers === 'string' 
        ? editForm.tiers.split(',').map((t: string) => t.trim()).filter(Boolean)
        : editForm.tiers;
      onSaveInline({ ...player, ...editForm, tiers: updatedTiers }, player.id);
    }
    setEditingId(null);
    setConfirmId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setConfirmId(null);
  };

  if (filteredPlayers.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm text-center text-gray-400 py-12"
      >
        No players found matching "{searchQuery}"
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm"
      role="table"
      aria-label="Player Rankings"
    >
      <div className="min-w-[700px] overflow-x-auto">
        <div className="p-4 border-b border-white/10 flex gap-2 overflow-x-auto">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setRegionFilter(region)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border",
                regionFilter === region 
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border-transparent"
              )}
            >
              {region}
            </button>
          ))}
        </div>
        <div 
          className={cn(
            "sticky top-0 z-10 grid gap-4 p-4 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-semibold bg-black/90 backdrop-blur-sm items-center",
          )}
          style={{ gridTemplateColumns: columnWidths.map(w => `${w}px`).join(' ') }}
          role="rowgroup"
        >
          <div className="text-center relative" role="columnheader">#<Resizer onResize={(d) => setColumnWidths(prev => prev.map((w, i) => i === 0 ? Math.max(50, w + d) : w))} /></div>
          <div className="flex items-center gap-1 relative" role="columnheader">Player <Tooltip text="Player Name, Role, and Tiers"><Info className="w-3 h-3 text-gray-500"/></Tooltip><Resizer onResize={(d) => setColumnWidths(prev => prev.map((w, i) => i === 1 ? Math.max(100, w + d) : w))} /></div>
          <div className="text-center relative" role="columnheader">Region<Resizer onResize={(d) => setColumnWidths(prev => prev.map((w, i) => i === 2 ? Math.max(50, w + d) : w))} /></div>
          <div className="text-center flex items-center justify-center gap-1 relative" role="columnheader">Points <Tooltip text="Total points"><Info className="w-3 h-3 text-gray-500"/></Tooltip><Resizer onResize={(d) => setColumnWidths(prev => prev.map((w, i) => i === 3 ? Math.max(50, w + d) : w))} /></div>
          {isAdmin && <div className="text-right relative" role="columnheader">Edit{isAdmin && <Resizer onResize={(d) => setColumnWidths(prev => prev.map((w, i) => i === 4 ? Math.max(50, w + d) : w))} />}</div>}
        </div>
        
        <div className="flex flex-col" role="rowgroup">
          {filteredPlayers.map((player, idx) => (
            <div 
              key={player.id ? `player-${player.id}-${idx}` : `player-idx-${idx}`} 
              className={cn(
                "grid gap-4 p-4 items-center border-b border-white/5 hover:bg-white/10 transition-colors group cursor-pointer",
                idx < 3 ? "bg-white/[0.02]" : "",
                editingId === player.id && "bg-purple-900/20 border-purple-500/50 hover:bg-purple-900/30"
              )}
              style={{ gridTemplateColumns: columnWidths.map(w => `${w}px`).join(' ') }}
              role="row"
            >
              <div className="text-center" role="cell">
                <div className="relative inline-block group/rank">
                  {idx < 3 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0, y: [0, -5, 0] }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 15,
                        y: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="absolute -top-6 -left-3 z-10"
                    >
                      <Crown className={cn(
                        "w-6 h-6 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                        idx === 0 ? "text-yellow-400" : 
                        idx === 1 ? "text-gray-300" : "text-amber-600"
                      )} />
                    </motion.div>
                  )}
                  <span className={cn(
                    "font-black text-xl font-display",
                    idx === 0 ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : 
                    idx === 1 ? "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" : 
                    idx === 2 ? "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" : "text-gray-500"
                  )}>
                    {player.rank}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[200px] bg-[#151619] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/rank:opacity-100 group-hover/rank:visible transition-all z-20 p-3 pointer-events-none">
                    <div className="text-xs text-gray-400 flex flex-col gap-1.5 text-left">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Points:</span> 
                        <span className="text-purple-400 font-bold font-mono">{player.points}</span>
                      </div>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[#151619] border-b border-r border-white/10 rotate-45 -mt-1"></div>
                  </div>
                </div>
              </div>

              <div role="cell">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shrink-0">
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
                    <div className="font-bold text-white text-base group-hover:text-purple-400 transition-colors flex items-center gap-2 flex-wrap">
                      <span className="truncate">{player.name}</span>
                      {editingId === player.id ? (
                        <input
                          type="text"
                          value={editForm.tiers}
                          onChange={(e) => setEditForm({ ...editForm, tiers: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Tiers (e.g. HT5, LT3)"
                          className="text-sm bg-black/60 border-2 border-purple-500 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 w-full shadow-xl shadow-purple-900/20 transition-all"
                        />
                      ) : (
                        player.tiers && player.tiers.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {player.tiers.map((tier: string, i: number) => (
                              <span key={`${tier}-${i}`} className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 border border-white/5 text-gray-300 font-medium leading-none tracking-wide">
                                {tier}
                              </span>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                    {editingId === player.id ? (
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm bg-black/60 border-2 border-purple-500 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 w-full mt-1 shadow-xl shadow-purple-900/20 transition-all"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 font-medium truncate">{player.role}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-400 font-mono tracking-wider" role="cell">{player.region}</div>
              
              <div className="text-center font-bold text-white text-lg font-mono" role="cell">
                {editingId === player.id ? (
                  <input
                    type="number"
                    value={editForm.points}
                    onChange={(e) => setEditForm({ ...editForm, points: Number(e.target.value) })}
                    onClick={(e) => e.stopPropagation()}
                    className="text-center text-sm bg-black/60 border-2 border-purple-500 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 w-20 shadow-xl shadow-purple-900/20 transition-all"
                  />
                ) : (
                  player.points
                )}
              </div>

              {isAdmin && (
                <div className="text-right flex justify-end" role="cell">
                  {confirmId === player.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={(e) => confirmSave(e, player)}
                        className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors border border-green-500/30"
                        title="Confirm Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors border border-red-500/30"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : editingId === player.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={(e) => handleSaveClick(e, player)}
                        className="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-colors border border-purple-500/30"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors border border-white/10"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => startEdit(e, player)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors border border-white/5"
                        title="Quick Edit (Role, Points & Tiers)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlayer(player);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-purple-400 transition-colors border border-white/5"
                        title="Full Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePlayer?.(player);
                        }}
                        className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors border border-white/5 hover:border-red-500/30"
                        title="Delete Player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <PlayerEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        player={editingPlayer} 
        onSave={(updatedPlayer) => {
          onEditPlayer?.(updatedPlayer);
          setIsModalOpen(false);
        }}
      />
    </motion.div>
  );
}
