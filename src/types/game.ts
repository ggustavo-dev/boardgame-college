export const PLAYER_COLORS = [
  { name: 'Rosa', value: '#E91E63', bgClass: 'bg-pink-500' },
  { name: 'Amarelo', value: '#FFC107', bgClass: 'bg-yellow-500' },
  { name: 'Azul', value: '#2196F3', bgClass: 'bg-blue-500' },
  { name: 'Vermelho', value: '#F44336', bgClass: 'bg-red-500' },
  { name: 'Laranja', value: '#FF9800', bgClass: 'bg-orange-500' },
  { name: 'Verde', value: '#4CAF50', bgClass: 'bg-green-500' },
];

export type PlayerSetup = {
  name: string;
  color: string;
  colorName: string;
};

export type GameSetup = {
  playerCount: number;
  players: PlayerSetup[];
};

export type SpaceType = 'activity' | 'stress' | 'collaboration' | 'reward' | 'start' | 'finish';

export type CardAction = {
  type: SpaceType;
  title: string;
  description: string;
  position: number;
};
