import { X, Timer, Zap, Handshake, Gift } from 'lucide-react';
import { Player } from '../lib/supabase';

type CardModalProps = {
  type: 'activity' | 'stress' | 'collaboration' | 'reward';
  title: string;
  description: string;
  position: number;
  currentPlayer: Player;
  allPlayers: Player[];
  onClose: () => void;
  onComplete: () => void;
  onShareCard?: (fromPlayerId: string, toPlayerId: string) => void;
};

export function CardModal({
  type,
  title,
  description,
  position,
  currentPlayer,
  allPlayers,
  onClose,
  onComplete,
  onShareCard,
}: CardModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'activity':
        return <Timer className="w-12 h-12" />;
      case 'stress':
        return <Zap className="w-12 h-12" />;
      case 'collaboration':
        return <Handshake className="w-12 h-12" />;
      case 'reward':
        return <Gift className="w-12 h-12" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'activity':
        return 'bg-slate-700';
      case 'stress':
        return 'bg-red-500';
      case 'collaboration':
        return 'bg-emerald-500';
      case 'reward':
        return 'bg-amber-400';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'activity':
        return 'Carta de Atividade';
      case 'stress':
        return 'Carta de Estresse';
      case 'collaboration':
        return 'Colaboração';
      case 'reward':
        return 'Recompensa';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'activity':
        return 'Complete esta atividade e ganhe +1 carta de atividade!';
      case 'stress':
        return 'Você perdeu 1 carta de estresse (vida)!';
      case 'collaboration':
        return 'Outro jogador pode compartilhar uma carta de estresse com você!';
      case 'reward':
        return 'Parabéns! Você recebeu uma bonificação!';
    }
  };

  const otherPlayers = allPlayers.filter(p => p.id !== currentPlayer.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className={`${getColor()} text-white p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            {getIcon()}
            <div>
              <div className="text-sm opacity-90">Casa {position}</div>
              <h2 className="text-2xl font-bold">{getTitle()}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-2">{getMessage()}</p>
            <p className="text-gray-700">{description}</p>
          </div>

          {type === 'activity' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Cartas de Atividade atuais:</strong> {currentPlayer.activity_cards}/10
              </p>
            </div>
          )}

          {type === 'stress' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-900">
                <strong>Cartas de Estresse restantes:</strong> {currentPlayer.stress_cards}/10
              </p>
              {currentPlayer.stress_cards === 0 && (
                <p className="text-sm font-bold text-red-600 mt-2">
                  Você ficou sem cartas de estresse! Fim de jogo para você.
                </p>
              )}
            </div>
          )}

          {type === 'collaboration' && onShareCard && otherPlayers.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                Outros jogadores podem compartilhar uma carta de estresse:
              </p>
              {otherPlayers.map(player => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: player.color }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{player.name}</div>
                      <div className="text-xs text-gray-600">
                        {player.stress_cards} cartas de estresse
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (player.stress_cards > 0) {
                        onShareCard(player.id, currentPlayer.id);
                      }
                    }}
                    disabled={player.stress_cards === 0}
                    className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    Compartilhar
                  </button>
                </div>
              ))}
            </div>
          )}

          {type === 'reward' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900">
                Você recebeu uma recompensa especial! Continue jogando bem!
              </p>
            </div>
          )}

          <button
            onClick={onComplete}
            className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
