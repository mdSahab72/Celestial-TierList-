import { Trophy, Diamond, Sword, Shield, Flame, Skull, Axe, Hammer } from 'lucide-react';

export const categories = [
  { id: 'overall', label: 'Overall', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: 'crystal', label: 'Crystal', icon: Diamond, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { id: 'sword', label: 'Sword', icon: Sword, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'uhc', label: 'UHC', icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'pot', label: 'Pot', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { id: 'netherite', label: 'Netherite Pot', icon: Skull, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'smp', label: 'SMP', icon: Trophy, color: 'text-green-400', bg: 'bg-green-500/20' },
  { id: 'axe', label: 'Axe', icon: Axe, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 'mace', label: 'Mace', icon: Hammer, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
];

export const mockPlayers = [
  { rank: 1, name: 'GummyBearTheGOAT', region: 'AS/EU', points: 64, tiers: ['HT5', 'LT5', 'HT4'], role: 'Combat Specialist' },
  { rank: 2, name: 'OrionOp_', region: 'AS/AU', points: 52, tiers: ['LT3'], role: 'Sword Master' },
  { rank: 3, name: 'CurzClaps', region: 'AS/AU', points: 48, tiers: ['LT2'], role: 'Netherite Pro' },
  { rank: 4, name: 'RyuGotSkills', region: 'AS/AU', points: 45, tiers: ['HT3'], role: 'Netherite Pro' },
  { rank: 5, name: 'Sp3yer_PlayzZ', region: 'AS/AU', points: 42, tiers: ['LT3'], role: 'Netherite Pro' },
  { rank: 7, name: 'Arr0w0982', region: 'AS/AU', points: 35, tiers: ['LT3'], role: 'Netherite Pro' },
  { rank: 8, name: 'Vic1ious_', region: 'AS/AU', points: 30, tiers: ['LT4'], role: 'Netherite Pro' },
  { rank: 9, name: 'Mr_Bhavesh', region: 'AS/AU', points: 25, tiers: ['Tier 5'], role: 'Netherite Pro' },
];

export const categoryPlayers = [
  { category: 'smp', tier: 3, name: 'GummyBearTheGOAT', region: 'AS/AU' },
  { category: 'uhc', tier: 3, name: 'GummyBearTheGOAT', region: 'AS/AU' },
  { category: 'sword', tier: 3, name: 'GummyBearTheGOAT', region: 'AS/AU' },
  { category: 'sword', tier: 3, name: 'OrionOp_', region: 'AS/AU' },
  { category: 'pot', tier: 3, name: 'GummyBearTheGOAT', region: 'AS/AU' },
  { category: 'axe', tier: 2, name: 'GummyBearTheGOAT', region: 'AS/AU' },
  { category: 'netherite', tier: 2, name: 'CurzClaps', region: 'AS/AU' },
  { category: 'netherite', tier: 3, name: 'GummyBearTheGOAT', region: 'AS/AU' },
  { category: 'netherite', tier: 3, name: 'RyuGotSkills', region: 'AS/AU' },
  { category: 'netherite', tier: 3, name: 'Sp3yer_PlayzZ', region: 'AS/AU' },
  { category: 'netherite', tier: 3, name: 'Arr0w0982', region: 'AS/AU' },
  { category: 'netherite', tier: 3, name: 'OrionOp_', region: 'AS/AU' },
  { category: 'netherite', tier: 4, name: 'Vic1ious_', region: 'AS/AU' },
  { category: 'netherite', tier: 5, name: 'Mr_Bhavesh', region: 'AS/AU' },
  { category: 'mace', tier: 4, name: 'GummyBearTheGOAT', region: 'AS/AU' },
];
