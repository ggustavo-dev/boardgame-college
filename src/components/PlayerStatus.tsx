import { Timer, Zap, Crown } from 'lucide-react';
import { Player } from '../lib/supabase';

type PlayerStatusProps = {
  players: Player[];
  currentPlayerIndex: number;
};

export function PlayerStatus({ players, currentPlayerIndex }: PlayerStatusProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Jogadores</h3>

      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentPlayer = index === currentPlayerIndex;
          const isOut = player.stress_cards === 0;

          return (
            <div
              key={player.id}
              className={`p-4 rounded-xl transition-all ${
                isCurrentPlayer
                  ? 'bg-amber-100 border-2 border-amber-400 shadow-lg'
                  : 'bg-gray-50 border-2 border-transparent'
              } ${isOut ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full border-3 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: player.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{player.name}</span>
                    {isCurrentPlayer && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                    {isOut && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                        FORA
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">Casa {player.position}</div>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-slate-700" />
                  <span className="font-semibold text-gray-700">
                    {player.activity_cards}
                  </span>
                  <span className="text-gray-500">atividades</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-gray-700">
                    {player.stress_cards}
                  </span>
                  <span className="text-gray-500">/ 10</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-slate-700" />
            <span>Cartas de Atividade: Complete atividades</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Cartas de Estresse: Suas vidas (máx. 10)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
