import { useState } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { GameContainer } from './components/GameContainer';

type GameState = 'title' | 'playing';

export function App() {
  const [gameState, setGameState] = useState<GameState>('title');

  return (
    <div className="app-root">
      {gameState === 'title' && (
        <TitleScreen onStart={() => setGameState('playing')} />
      )}
      {gameState === 'playing' && <GameContainer />}
    </div>
  );
}
