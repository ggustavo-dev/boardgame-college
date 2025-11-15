/*
  # Create Game Tables for Trilha do Equilíbrio

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `status` (text) - 'setup', 'playing', 'finished'
      - `current_player_index` (integer) - index of current player
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `players`
      - `id` (uuid, primary key)
      - `game_id` (uuid, foreign key)
      - `name` (text) - player name
      - `color` (text) - player color
      - `position` (integer) - current board position (0-46)
      - `activity_cards` (integer) - number of activity cards (max 10)
      - `stress_cards` (integer) - number of stress cards (starts at 10)
      - `player_order` (integer) - turn order
      - `created_at` (timestamp)
    
    - `board_spaces`
      - `id` (uuid, primary key)
      - `position` (integer) - space number (1-46)
      - `type` (text) - 'activity', 'stress', 'collaboration', 'reward', 'start', 'finish'
      - `activity_text` (text) - activity description
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a local game)
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'setup',
  current_player_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  activity_cards integer NOT NULL DEFAULT 0,
  stress_cards integer NOT NULL DEFAULT 10,
  player_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS board_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL UNIQUE,
  type text NOT NULL,
  activity_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read games"
  ON games FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert games"
  ON games FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update games"
  ON games FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read players"
  ON players FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert players"
  ON players FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON players FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read board spaces"
  ON board_spaces FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert board spaces"
  ON board_spaces FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
