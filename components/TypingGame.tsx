
import React, { useEffect, useState, useRef } from 'react';
import { GameWord } from '../types';
import { GAME_WORDS } from '../constants';

interface TypingGameProps {
  onExit: () => void;
}

type Difficulty = 'easy' | 'normal' | 'hard';
type GameState = 'menu' | 'playing' | 'gameover';

const LEVEL_CONFIG = {
  easy: { 
    label: 'Dễ', 
    baseSpeed: 0.05, 
    speedIncrement: 0.002, 
    spawnInterval: 2500,
    color: 'bg-green-500'
  },
  normal: { 
    label: 'Thường', 
    baseSpeed: 0.1, 
    speedIncrement: 0.005, 
    spawnInterval: 1800,
    color: 'bg-yellow-500' 
  },
  hard: { 
    label: 'Khó', 
    baseSpeed: 0.2, 
    speedIncrement: 0.01, 
    spawnInterval: 1200,
    color: 'bg-red-500' 
  }
};

const TypingGame: React.FC<TypingGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [words, setWords] = useState<GameWord[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  
  const gameLoopRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);

  const startGame = (level: Difficulty) => {
    setDifficulty(level);
    setScore(0);
    setWords([]);
    setInput('');
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const config = LEVEL_CONFIG[difficulty];

    // Spawn Logic
    const spawnWord = () => {
      const newWord: GameWord = {
        id: Date.now(),
        word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)],
        x: Math.random() * 80 + 10, // 10% to 90% width
        y: -10,
        // Speed logic: Base + random variance + (score factor)
        speed: config.baseSpeed + (Math.random() * 0.05) + (score * config.speedIncrement)
      };
      setWords(prev => [...prev, newWord]);
    };

    // Calculate dynamic spawn rate (gets faster as you score more, but capped)
    const currentSpawnRate = Math.max(800, config.spawnInterval - (score * 20));
    spawnRef.current = window.setInterval(spawnWord, currentSpawnRate);

    // Physics Loop
    const loop = () => {
      setWords(prev => {
        const nextWords = prev.map(w => ({ ...w, y: w.y + w.speed }));
        
        // Check collision (Game Over if word hits bottom)
        if (nextWords.some(w => w.y > 90)) {
          setGameState('gameover');
        }
        return nextWords.filter(w => w.y <= 90);
      });
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnRef.current);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, difficulty, score]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const val = e.target.value;
    
    // Check match
    const matchIndex = words.findIndex(w => w.word === val.trim().toLowerCase());
    if (matchIndex !== -1) {
      setScore(s => s + 1);
      setWords(prev => prev.filter((_, i) => i !== matchIndex));
      setInput('');
      
      // Play sound effect (optional/visual feedback)
    } else {
      setInput(val);
    }
  };

  // --- RENDER: GAME OVER ---
  if (gameState === 'gameover') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-slate-900 text-white animate-in fade-in">
        <h2 className="text-5xl font-extrabold text-red-500 mb-2">Thua Rồi! 😢</h2>
        <p className="text-xl mb-6">Cấp độ: <span className="text-yellow-400 font-bold">{LEVEL_CONFIG[difficulty].label}</span></p>
        
        <div className="bg-white/10 p-6 rounded-2xl mb-8 border border-white/20">
            <p className="text-sm uppercase tracking-widest text-slate-400">Điểm số</p>
            <p className="text-6xl font-bold text-white">{score}</p>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setGameState('menu')} className="px-8 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 font-bold text-lg transition-transform hover:scale-105">
            Chơi lại
          </button>
          <button onClick={onExit} className="px-8 py-3 bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 font-bold text-lg">
            Thoát
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: MENU (LEVEL SELECT) ---
  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="mb-12">
            <div className="text-8xl mb-4 animate-bounce">🌧️</div>
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Mưa Từ Vựng
            </h2>
            <p className="text-slate-300">Gõ đúng từ trước khi chúng rơi xuống đất!</p>
        </div>
        
        <h3 className="text-xl font-bold mb-6 text-white/80">Chọn độ khó:</h3>
        
        <div className="flex gap-6">
          {(Object.keys(LEVEL_CONFIG) as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => startGame(level)}
              className={`
                group relative w-40 h-48 rounded-2xl border-b-8 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center gap-4
                ${level === 'easy' ? 'bg-green-500 border-green-700 hover:bg-green-400' : ''}
                ${level === 'normal' ? 'bg-yellow-500 border-yellow-700 hover:bg-yellow-400' : ''}
                ${level === 'hard' ? 'bg-red-500 border-red-700 hover:bg-red-400' : ''}
              `}
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">
                {level === 'easy' ? '🐣' : level === 'normal' ? '🐯' : '🐲'}
              </div>
              <span className="text-2xl font-extrabold text-white shadow-sm">{LEVEL_CONFIG[level].label}</span>
            </button>
          ))}
        </div>

        <button onClick={onExit} className="mt-16 text-slate-400 hover:text-white underline underline-offset-4">
            Quay về Menu Trò Chơi
        </button>
      </div>
    );
  }

  // --- RENDER: PLAYING ---
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 text-white rounded-xl shadow-inner cursor-default">
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${LEVEL_CONFIG[difficulty].color} text-white`}>
                {LEVEL_CONFIG[difficulty].label}
            </div>
            <span className="font-bold text-2xl font-mono">Điểm: {score}</span>
        </div>
        <button onClick={() => setGameState('gameover')} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-red-500/80 transition-colors">
            Kết thúc
        </button>
      </div>

      {/* Falling Words */}
      {words.map(w => (
        <div 
          key={w.id} 
          className="absolute bg-white/90 text-slate-900 px-4 py-1.5 rounded-full font-bold shadow-lg transform -translate-x-1/2 border-2 border-blue-200"
          style={{ left: `${w.x}%`, top: `${w.y}%`, fontSize: '1.2rem' }}
        >
          {w.word}
        </div>
      ))}

      {/* Input Area */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <input 
          type="text" 
          value={input}
          onChange={handleInput}
          autoFocus
          className="w-full px-6 py-4 rounded-full bg-slate-800/80 backdrop-blur border-4 border-blue-500 text-white text-center text-3xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-2xl placeholder:text-slate-600"
          placeholder="Gõ từ ở đây..."
        />
        <p className="text-center text-slate-400 mt-2 text-sm">Gõ từ tiếng Việt không dấu</p>
      </div>
      
      {/* Danger Zone Line */}
      <div className="absolute bottom-0 w-full h-2 bg-red-600/50 blur-sm animate-pulse" />
    </div>
  );
};

export default TypingGame;
