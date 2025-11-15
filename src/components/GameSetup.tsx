import { useState } from 'react';
import { PLAYER_COLORS, PlayerSetup } from '../types/game';

type GameSetupProps = {
  onStartGame: (players: PlayerSetup[]) => void;
};

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<PlayerSetup[]>([
    { name: '', color: PLAYER_COLORS[0].value, colorName: PLAYER_COLORS[0].name },
    { name: '', color: PLAYER_COLORS[1].value, colorName: PLAYER_COLORS[1].name },
  ]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const newPlayers = [...players];

    if (count > players.length) {
      for (let i = players.length; i < count; i++) {
        newPlayers.push({
          name: '',
          color: PLAYER_COLORS[i % PLAYER_COLORS.length].value,
          colorName: PLAYER_COLORS[i % PLAYER_COLORS.length].name,
        });
      }
    } else {
      newPlayers.splice(count);
    }

    setPlayers(newPlayers);
  };

  const handlePlayerChange = (index: number, field: 'name' | 'color', value: string) => {
    const newPlayers = [...players];
    if (field === 'color') {
      const selectedColor = PLAYER_COLORS.find(c => c.value === value);
      if (selectedColor) {
        newPlayers[index].color = value;
        newPlayers[index].colorName = selectedColor.name;
      }
    } else {
      newPlayers[index][field] = value;
    }
    setPlayers(newPlayers);
  };

  const isValid = players.every(p => p.name.trim() !== '');
  const usedColors = new Set(players.map(p => p.color));
  const hasDuplicateColors = usedColors.size !== players.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Trilha do Equilíbrio
        </h1>
        <p className="text-center text-gray-600 mb-8">Configure sua partida</p>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Número de Jogadores
          </label>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6].map(count => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  playerCount === count
                    ? 'bg-amber-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count} jogadores
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 font-bold text-gray-700 w-24">
                Jogador {index + 1}
              </div>

              <input
                type="text"
                placeholder="Nome"
                value={player.name}
                onChange={e => handlePlayerChange(index, 'name', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />

              <div className="flex gap-2">
                {PLAYER_COLORS.map(colorOption => (
                  <button
                    key={colorOption.value}
                    onClick={() => handlePlayerChange(index, 'color', colorOption.value)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      player.color === colorOption.value
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasDuplicateColors && (
          <p className="text-red-600 text-sm mb-4 text-center">
            Cada jogador deve escolher uma cor diferente
          </p>
        )}

        <button
          onClick={() => onStartGame(players)}
          disabled={!isValid || hasDuplicateColors}
          className="w-full py-4 bg-amber-500 text-white font-bold text-lg rounded-xl hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          Iniciar Jogo
        </button>
      </div>
    </div>
  );
}
