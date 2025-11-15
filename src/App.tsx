import { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { Game } from './components/Game';
import { PlayerSetup } from './types/game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSetups, setPlayerSetups] = useState<PlayerSetup[]>([]);

  const handleStartGame = (players: PlayerSetup[]) => {
    setPlayerSetups(players);
    setGameStarted(true);
  };

  const handleBackToSetup = () => {
    setGameStarted(false);
    setPlayerSetups([]);
  };

  if (gameStarted) {
    return <Game playerSetups={playerSetups} onBackToSetup={handleBackToSetup} />;
  }

  return <GameSetup onStartGame={handleStartGame} />;
}

export default App;
