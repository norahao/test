import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Play, Pause, Trophy } from 'lucide-react';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 150; // constant game speed

function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });


  // Memoized food generation to avoid placing food on snake
  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
      attempts < maxAttempts
    );

    return newFood;
  }, []);

  // Memoized grid cells for better performance
  const gridCells = useMemo(() => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      return { x, y, index };
    });
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameState('idle');
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const pauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('gameOver');
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameOver');
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        
        // Update high score
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        
        // Generate new food
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState, score, highScore, generateFood]);

  // Game loop with constant speed
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'idle') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (gameState === 'gameOver') {
            resetGame();
          } else if (gameState === 'playing') {
            pauseGame();
          } else if (gameState === 'paused' || gameState === 'idle') {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, resetGame, startGame, pauseGame]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
      } else {
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
      } else {
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Snake Game</h1>
          <p className="text-gray-600">Use arrow keys or WASD to control the snake</p>
        </div>

        {/* Score and Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold text-emerald-600">
              Score: {score}
            </div>
            <div className="flex items-center gap-1 text-lg text-amber-600">
              <Trophy size={16} />
              High Score: {highScore}
            </div>

          </div>
          <div className="flex gap-3">
            {gameState === 'idle' && (
              <button
                onClick={startGame}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Play size={18} />
                Start
              </button>
            )}
            {gameState === 'playing' && (
              <button
                onClick={pauseGame}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Pause size={18} />
                Pause
              </button>
            )}
            {gameState === 'paused' && (
              <button
                onClick={startGame}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Play size={18} />
                Resume
              </button>
            )}
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="relative bg-gray-900 rounded-xl p-4 mb-6 touch-none"
          onTouchStart={handleTouchStart}
        >
          <div 
            className="grid gap-1 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              maxWidth: '500px',
              aspectRatio: '1'
            }}
          >
            {gridCells.map(({ x, y, index }) => {
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`aspect-square rounded-sm transition-all duration-100 ${
                    isFood
                      ? 'bg-red-500 shadow-lg transform scale-110'
                      : isHead
                      ? 'bg-emerald-400 shadow-md'
                      : isSnake
                      ? 'bg-emerald-500'
                      : 'bg-gray-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Game Over Overlay */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black bg-opacity-75 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                <p className="text-xl mb-2">Final Score: {score}</p>
                {score === highScore && score > 0 && (
                  <p className="text-lg text-amber-400 mb-4">🏆 New High Score! 🏆</p>
                )}
                <button
                  onClick={resetGame}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* Pause Overlay */}
          {gameState === 'paused' && snake.length > 1 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Paused</h2>
                <p className="text-lg">Press spacebar or click Resume to continue</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600 space-y-2">
          <p>🎯 Eat the red food to grow and increase your score</p>
          <p>⌨️ Use arrow keys or WASD to move • Spacebar to pause/resume</p>
          <p>📱 Swipe on mobile devices to control direction</p>
          <p>🚫 Avoid hitting walls or yourself</p>
          <p>⚡ Game speeds up as you eat more food!</p>
        </div>
      </div>
    </div>
  );
}

export default App;