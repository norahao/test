import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';

function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

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
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
          break;
        case ' ':
          e.preventDefault();
          if (gameOver) {
            resetGame();
          } else {
            setIsPlaying(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver]);

  const startGame = () => {
    setIsPlaying(true);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Snake Game</h1>
          <p className="text-gray-600">Use arrow keys to control the snake</p>
        </div>

        {/* Score and Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold text-emerald-600">
            Score: {score}
          </div>
          <div className="flex gap-3">
            {!isPlaying && !gameOver && (
              <button
                onClick={startGame}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Play size={18} />
                Start
              </button>
            )}
            {isPlaying && (
              <button
                onClick={pauseGame}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Pause size={18} />
                Pause
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
        <div className="relative bg-gray-900 rounded-xl p-4 mb-6">
          <div 
            className="grid gap-1 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              maxWidth: '500px',
              aspectRatio: '1'
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
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
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-75 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                <p className="text-xl mb-4">Final Score: {score}</p>
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
          {!isPlaying && !gameOver && snake.length > 1 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Paused</h2>
                <p className="text-lg">Press spacebar or click Start to continue</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600 space-y-2">
          <p>🎯 Eat the red food to grow and increase your score</p>
          <p>⌨️ Use arrow keys to move • Spacebar to pause/resume</p>
          <p>🚫 Avoid hitting walls or yourself</p>
        </div>
      </div>
    </div>
  );
}

export default App;