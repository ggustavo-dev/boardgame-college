import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Game = {
  id: string;
  status: 'setup' | 'playing' | 'finished';
  current_player_index: number;
  created_at: string;
  updated_at: string;
};

export type Player = {
  id: string;
  game_id: string;
  name: string;
  color: string;
  position: number;
  activity_cards: number;
  stress_cards: number;
  player_order: number;
  created_at: string;
};

export type BoardSpace = {
  id: string;
  position: number;
  type: 'activity' | 'stress' | 'collaboration' | 'reward' | 'start' | 'finish';
  activity_text: string | null;
  created_at: string;
};
