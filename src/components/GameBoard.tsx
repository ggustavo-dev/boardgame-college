import { Timer, Zap, Handshake, Gift } from 'lucide-react';
import { BoardSpace, Player } from '../lib/supabase';

type GameBoardProps = {
  boardSpaces: BoardSpace[];
  players: Player[];
  onSpaceClick: (space: BoardSpace) => void;
};

const SPACE_POSITIONS = [
  { top: '12%', left: '18%', rotate: 0 },
  { top: '8%', left: '25%', rotate: 0 },
  { top: '6%', left: '33%', rotate: 10 },
  { top: '6%', left: '42%', rotate: 10 },
  { top: '8%', left: '50%', rotate: 0 },
  { top: '10%', left: '58%', rotate: 0 },
  { top: '13%', left: '65%', rotate: -10 },
  { top: '16%', left: '72%', rotate: -10 },
  { top: '20%', left: '78%', rotate: -20 },
  { top: '25%', left: '82%', rotate: -30 },
  { top: '30%', left: '84%', rotate: -40 },
  { top: '36%', left: '83%', rotate: -50 },
  { top: '42%', left: '80%', rotate: -60 },
  { top: '47%', left: '75%', rotate: -70 },
  { top: '51%', left: '69%', rotate: -80 },
  { top: '54%', left: '62%', rotate: -90 },
  { top: '55%', left: '55%', rotate: -100 },
  { top: '54%', left: '48%', rotate: -110 },
  { top: '51%', left: '41%', rotate: -120 },
  { top: '47%', left: '35%', rotate: -130 },
  { top: '42%', left: '30%', rotate: -140 },
  { top: '37%', left: '26%', rotate: -150 },
  { top: '31%', left: '24%', rotate: -160 },
  { top: '25%', left: '23%', rotate: -170 },
  { top: '33%', left: '37%', rotate: 180 },
  { top: '35%', left: '44%', rotate: 170 },
  { top: '37%', left: '51%', rotate: 160 },
  { top: '40%', left: '57%', rotate: 150 },
  { top: '44%', left: '63%', rotate: 140 },
  { top: '48%', left: '67%', rotate: 130 },
  { top: '53%', left: '70%', rotate: 120 },
  { top: '58%', left: '71%', rotate: 110 },
  { top: '63%', left: '70%', rotate: 100 },
  { top: '67%', left: '67%', rotate: 90 },
  { top: '70%', left: '62%', rotate: 80 },
  { top: '71%', left: '56%', rotate: 70 },
  { top: '71%', left: '49%', rotate: 60 },
  { top: '70%', left: '42%', rotate: 50 },
  { top: '67%', left: '36%', rotate: 40 },
  { top: '63%', left: '31%', rotate: 30 },
  { top: '58%', left: '27%', rotate: 20 },
  { top: '35%', left: '18%', rotate: 10 },
  { top: '43%', left: '20%', rotate: 0 },
  { top: '50%', left: '23%', rotate: -10 },
  { top: '56%', left: '28%', rotate: -20 },
  { top: '61%', left: '34%', rotate: -30 },
];

export function GameBoard({ boardSpaces, players, onSpaceClick }: GameBoardProps) {
  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <Timer className="w-5 h-5" />;
      case 'stress':
        return <Zap className="w-5 h-5" />;
      case 'collaboration':
        return <Handshake className="w-5 h-5" />;
      case 'reward':
        return <Gift className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getSpaceColor = (type: string) => {
    switch (type) {
      case 'activity':
        return 'bg-slate-700 hover:bg-slate-600';
      case 'stress':
        return 'bg-red-500 hover:bg-red-600';
      case 'collaboration':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'reward':
        return 'bg-amber-400 hover:bg-amber-500';
      case 'start':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'finish':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-400';
    }
  };

  const getPlayersAtPosition = (position: number) => {
    return players.filter(p => p.position === position);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-400 via-slate-300 to-slate-400 rounded-3xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0">
        {boardSpaces.map((space, index) => {
          const position = SPACE_POSITIONS[index] || { top: '50%', left: '50%', rotate: 0 };
          const playersHere = getPlayersAtPosition(space.position);

          return (
            <button
              key={space.id}
              onClick={() => onSpaceClick(space)}
              className={`absolute w-16 h-16 rounded-xl ${getSpaceColor(
                space.type
              )} text-white flex flex-col items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer border-2 border-white`}
              style={{
                top: position.top,
                left: position.left,
                transform: `translate(-50%, -50%) rotate(${position.rotate}deg)`,
              }}
            >
              <div className="text-xs font-bold mb-1">{space.position}</div>
              {getSpaceIcon(space.type)}

              {playersHere.length > 0 && (
                <div className="absolute -top-2 -right-2 flex gap-0.5">
                  {playersHere.map((player, idx) => (
                    <div
                      key={player.id}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: player.color, zIndex: idx }}
                      title={player.name}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legenda:</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-slate-700" />
            <span>Atividade</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Estresse</span>
          </div>
          <div className="flex items-center gap-2">
            <Handshake className="w-4 h-4 text-emerald-500" />
            <span>Colaboração</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Recompensa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
