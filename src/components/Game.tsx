import { useState, useEffect } from 'react';
import { supabase, Player, BoardSpace, Game as GameType } from '../lib/supabase';
import { PlayerSetup } from '../types/game';
import { GameBoard } from './GameBoard';
import { DiceRoller } from './DiceRoller';
import { CardModal } from './CardModal';
import { PlayerStatus } from './PlayerStatus';
import { Trophy } from 'lucide-react';

type GameProps = {
  playerSetups: PlayerSetup[];
  onBackToSetup: () => void;
};

type CardAction = {
  type: 'activity' | 'stress' | 'collaboration' | 'reward';
  title: string;
  description: string;
  position: number;
};

export function Game({ playerSetups, onBackToSetup }: GameProps) {
  const [game, setGame] = useState<GameType | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [boardSpaces, setBoardSpaces] = useState<BoardSpace[]>([]);
  const [currentCardAction, setCurrentCardAction] = useState<CardAction | null>(null);
  const [waitingForDice, setWaitingForDice] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    const { data: gameData } = await supabase
      .from('games')
      .insert({ status: 'playing', current_player_index: 0 })
      .select()
      .single();

    if (gameData) {
      setGame(gameData);

      const playerPromises = playerSetups.map((setup, index) =>
        supabase
          .from('players')
          .insert({
            game_id: gameData.id,
            name: setup.name,
            color: setup.color,
            position: 0,
            player_order: index,
            activity_cards: 0,
            stress_cards: 10,
          })
          .select()
          .single()
      );

      const playerResults = await Promise.all(playerPromises);
      const newPlayers = playerResults.map(r => r.data).filter(Boolean) as Player[];
      setPlayers(newPlayers);
    }

    const { data: spaces } = await supabase
      .from('board_spaces')
      .select('*')
      .order('position');

    if (spaces) {
      setBoardSpaces(spaces);
    }
  };

  const getCurrentPlayer = () => {
    if (!game || players.length === 0) return null;
    return players[game.current_player_index];
  };

  const handleDiceRoll = async (value: number) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer || !game) return;

    const newPosition = Math.min(currentPlayer.position + value, 46);

    await supabase
      .from('players')
      .update({ position: newPosition })
      .eq('id', currentPlayer.id);

    const updatedPlayers = [...players];
    updatedPlayers[game.current_player_index].position = newPosition;
    setPlayers(updatedPlayers);

    const space = boardSpaces.find(s => s.position === newPosition);
    if (space) {
      if (space.type === 'finish') {
        setWinner(currentPlayer);
        setGameFinished(true);
        await supabase.from('games').update({ status: 'finished' }).eq('id', game.id);
      } else if (space.type !== 'start') {
        setCurrentCardAction({
          type: space.type as CardAction['type'],
          title: space.activity_text || '',
          description: space.activity_text || '',
          position: space.position,
        });
      }
    }

    setWaitingForDice(false);
  };

  const handleCardComplete = async () => {
    if (!currentCardAction || !game) {
      setCurrentCardAction(null);
      nextTurn();
      return;
    }

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    const updates: Partial<Player> = {};

    if (currentCardAction.type === 'activity') {
      updates.activity_cards = Math.min(currentPlayer.activity_cards + 1, 10);
    } else if (currentCardAction.type === 'stress') {
      updates.stress_cards = Math.max(currentPlayer.stress_cards - 1, 0);
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from('players').update(updates).eq('id', currentPlayer.id);

      const updatedPlayers = [...players];
      updatedPlayers[game.current_player_index] = {
        ...currentPlayer,
        ...updates,
      };
      setPlayers(updatedPlayers);

      if (updates.stress_cards === 0) {
        alert(`${currentPlayer.name} ficou sem cartas de estresse e está fora do jogo!`);
      }
    }

    setCurrentCardAction(null);
    nextTurn();
  };

  const handleShareCard = async (fromPlayerId: string, toPlayerId: string) => {
    const fromPlayer = players.find(p => p.id === fromPlayerId);
    const toPlayer = players.find(p => p.id === toPlayerId);

    if (!fromPlayer || !toPlayer || fromPlayer.stress_cards === 0) return;

    await supabase
      .from('players')
      .update({ stress_cards: fromPlayer.stress_cards - 1 })
      .eq('id', fromPlayerId);

    await supabase
      .from('players')
      .update({ stress_cards: Math.min(toPlayer.stress_cards + 1, 10) })
      .eq('id', toPlayerId);

    const updatedPlayers = players.map(p => {
      if (p.id === fromPlayerId) {
        return { ...p, stress_cards: p.stress_cards - 1 };
      }
      if (p.id === toPlayerId) {
        return { ...p, stress_cards: Math.min(p.stress_cards + 1, 10) };
      }
      return p;
    });

    setPlayers(updatedPlayers);
  };

  const nextTurn = async () => {
    if (!game) return;

    const activePlayers = players.filter(p => p.stress_cards > 0);

    if (activePlayers.length <= 1) {
      setWinner(activePlayers[0] || null);
      setGameFinished(true);
      await supabase.from('games').update({ status: 'finished' }).eq('id', game.id);
      return;
    }

    let nextIndex = (game.current_player_index + 1) % players.length;

    while (players[nextIndex].stress_cards === 0) {
      nextIndex = (nextIndex + 1) % players.length;
    }

    await supabase
      .from('games')
      .update({ current_player_index: nextIndex })
      .eq('id', game.id);

    setGame({ ...game, current_player_index: nextIndex });
    setWaitingForDice(true);
  };

  const handleSpaceClick = (space: BoardSpace) => {
    if (space.type === 'start' || space.type === 'finish') return;

    setCurrentCardAction({
      type: space.type as CardAction['type'],
      title: space.activity_text || '',
      description: space.activity_text || '',
      position: space.position,
    });
  };

  const currentPlayer = getCurrentPlayer();

  if (gameFinished && winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Fim de Jogo!</h1>
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-amber-400 shadow-xl"
            style={{ backgroundColor: winner.color }}
          />
          <p className="text-2xl font-bold text-gray-900 mb-2">{winner.name} venceu!</p>
          <p className="text-gray-600 mb-8">
            Cartas de Atividade: {winner.activity_cards} | Cartas de Estresse: {winner.stress_cards}
          </p>
          <button
            onClick={onBackToSetup}
            className="px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-xl hover:bg-amber-600 transition-all shadow-lg"
          >
            Novo Jogo
          </button>
        </div>
      </div>
    );
  }

  if (!game || !currentPlayer || boardSpaces.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Carregando jogo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Trilha do Equilíbrio</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Vez de:</span>
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-800"
                  style={{ backgroundColor: currentPlayer.color }}
                />
                <span className="font-bold text-gray-900">{currentPlayer.name}</span>
              </div>
            </div>

            <button
              onClick={onBackToSetup}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              Novo Jogo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <GameBoard
              boardSpaces={boardSpaces}
              players={players}
              onSpaceClick={handleSpaceClick}
            />

            <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-center">
              <DiceRoller
                onRoll={handleDiceRoll}
                disabled={!waitingForDice || currentPlayer.stress_cards === 0}
              />
            </div>
          </div>

          <div>
            <PlayerStatus players={players} currentPlayerIndex={game.current_player_index} />
          </div>
        </div>
      </div>

      {currentCardAction && (
        <CardModal
          type={currentCardAction.type}
          title={currentCardAction.title}
          description={currentCardAction.description}
          position={currentCardAction.position}
          currentPlayer={currentPlayer}
          allPlayers={players}
          onClose={() => setCurrentCardAction(null)}
          onComplete={handleCardComplete}
          onShareCard={handleShareCard}
        />
      )}
    </div>
  );
}
