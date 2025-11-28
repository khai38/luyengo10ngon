
import React, { useEffect, useState, useRef } from 'react';
import { GAME_WORDS } from '../constants';

interface BubbleGameProps {
  onExit: () => void;
}

type Difficulty = 'easy' | 'normal' | 'hard';
type GameState = 'menu' | 'playing' | 'gameover';

interface Bubble {
  id: number;
  word: string;
  x: number; // Current visual X (0-100%)
  baseX: number; // The center axis for the wobble
  y: number; // Vertical position (110% -> -20%)
  speed: number;
  wobbleOffset: number; // To randomize the sine wave phase
  color: string;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  color: string;
}

const LEVEL_CONFIG = {
  easy: { 
    label: 'Dễ', 
    lives: 5, 
    spawnRate: 2500, 
    speed: 0.1 
  },
  normal: { 
    label: 'Thường', 
    lives: 3, 
    spawnRate: 1800, 
    speed: 0.2 
  },
  hard: { 
    label: 'Khó', 
    lives: 1, 
    spawnRate: 1200, 
    speed: 0.35 
  },
};

const BUBBLE_COLORS = [
    'bg-pink-400', 'bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400', 'bg-cyan-400'
];

// --- VISUAL COMPONENTS ---

const CloudSVG: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 100 60" className={className} style={style} fill="currentColor">
    <path d="M10,40 Q10,25 25,25 Q30,10 50,10 Q70,10 75,25 Q90,25 90,40 Q90,55 75,55 L25,55 Q10,55 10,40 Z" />
  </svg>
);

const BubbleMenuIconSVG = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-lg">
     <circle cx="50" cy="60" r="35" fill="#22d3ee" fillOpacity="0.8" />
     <circle cx="85" cy="30" r="15" fill="#f472b6" fillOpacity="0.6" />
     <circle cx="20" cy="30" r="18" fill="#a78bfa" fillOpacity="0.6" />
     {/* Highlights */}
     <path d="M40,50 Q50,40 60,50" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />
     <circle cx="65" cy="50" r="3" fill="white" opacity="0.8" />
  </svg>
);

const BubbleSVG: React.FC<{ word: string, colorClass: string, typed: string }> = ({ word, colorClass, typed }) => {
  const isMatch = word.startsWith(typed);
  const matchLen = isMatch ? typed.length : 0;

  return (
    <div className={`relative flex items-center justify-center rounded-full w-32 h-32 backdrop-blur-md border-2 border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] ${colorClass} bg-opacity-20 transition-all duration-100 ${isMatch && typed.length > 0 ? 'scale-110 border-white ring-4 ring-white/40 shadow-[0_0_30px_rgba(255,255,255,0.6)]' : ''}`}>
        {/* Shine/Reflection */}
        <div className="absolute top-5 left-5 w-8 h-4 bg-white/70 rounded-full transform -rotate-45 blur-[1px]"></div>
        <div className="absolute bottom-5 right-7 w-2 h-2 bg-white/50 rounded-full blur-[0.5px]"></div>
        
        <div className="z-10 text-xl select-none tracking-wide drop-shadow-md">
             <span className="font-extrabold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{word.slice(0, matchLen)}</span>
             <span className="font-bold text-slate-800/80">{word.slice(matchLen)}</span>
        </div>
    </div>
  );
};

const ExplosionEffect: React.FC<{ x: number, y: number, color: string }> = ({ x, y, color }) => {
  // Generate 12 particles
  const particles = Array.from({ length: 12 });
  
  return (
    <div 
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 50 }}
    >
        {/* Central Burst */}
        <div className="absolute inset-0 bg-white rounded-full animate-[ping_0.4s_cubic-bezier(0,0,0.2,1)_forwards] opacity-80 w-16 h-16 -m-8"></div>
        
        {/* Particles */}
        {particles.map((_, i) => {
            const rotate = i * 30; // 360 / 12
            return (
                <div 
                    key={i} 
                    className="absolute top-1/2 left-1/2 w-2 h-4 origin-bottom rounded-full"
                    style={{ 
                        transform: `rotate(${rotate}deg) translateY(-20px)`, 
                        opacity: 0
                    }}
                >
                   <div 
                      className={`w-3 h-3 rounded-full ${color.replace('bg-', 'bg-')} animate-[flyOut_0.6s_ease-out_forwards]`}
                      style={{ animationDelay: `${Math.random() * 0.1}s` }}
                   ></div>
                </div>
            );
        })}
    </div>
  );
};

// --- MAIN COMPONENT ---

const BubbleGame: React.FC<BubbleGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [input, setInput] = useState('');

  const gameLoopRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);
  const bubblesRef = useRef<Bubble[]>([]);

  // Keep ref synced with state
  useEffect(() => {
    bubblesRef.current = bubbles;
  }, [bubbles]);

  const startGame = (level: Difficulty) => {
    setDifficulty(level);
    setLives(LEVEL_CONFIG[level].lives);
    setScore(0);
    setBubbles([]);
    setExplosions([]);
    setInput('');
    setGameState('playing');
  };

  const spawnBubble = () => {
     const word = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
     const baseX = 10 + Math.random() * 80;
     const speed = LEVEL_CONFIG[difficulty].speed + (Math.random() * 0.05);

     setBubbles(prev => [...prev, {
         id: Date.now(),
         word,
         x: baseX,
         baseX,
         y: 110,
         speed,
         wobbleOffset: Math.random() * Math.PI * 2,
         color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]
     }]);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnRef.current = window.setInterval(spawnBubble, LEVEL_CONFIG[difficulty].spawnRate);

    const loop = () => {
       const now = Date.now();
       
       setBubbles(prev => {
           const nextBubbles = prev.map(b => {
               const newY = b.y - b.speed;
               const wobble = Math.sin((now / 500) + b.wobbleOffset) * 3;
               return { ...b, y: newY, x: b.baseX + wobble };
           });

           const survivedBubbles: Bubble[] = [];
           nextBubbles.forEach(b => {
               if (b.y < -15) {
                   setLives(l => {
                       const newLives = l - 1;
                       if (newLives <= 0) setGameState('gameover');
                       return newLives;
                   });
                   if (b.word.startsWith(input) && input.length > 0) {
                        const others = survivedBubbles.filter(ob => ob.word.startsWith(input));
                        if (others.length === 0) setInput('');
                   }
               } else {
                   survivedBubbles.push(b);
               }
           });

           return survivedBubbles;
       });
       
       setExplosions(prev => prev.filter(ex => now - ex.createdAt < 800)); // Keep longer for animation

       gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
        clearInterval(spawnRef.current);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, difficulty, input]);

  // Key Handler
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (gameState !== 'playing') return;

          if (e.key === 'Backspace') {
              setInput(prev => prev.slice(0, -1));
              return;
          }

          const char = e.key.toLowerCase();
          if (char.length !== 1 || !/[a-z]/.test(char)) return;

          const nextInput = input + char;
          const currentBubbles = bubblesRef.current;
          
          const matches = currentBubbles.filter(b => b.word.toLowerCase().startsWith(nextInput));

          if (matches.length > 0) {
              setInput(nextInput);
              const exactMatch = matches.find(b => b.word.toLowerCase() === nextInput);
              if (exactMatch) {
                  // POP!
                  setExplosions(ex => [...ex, { 
                    id: Date.now(), 
                    x: exactMatch.x, 
                    y: exactMatch.y, 
                    createdAt: Date.now(),
                    color: exactMatch.color
                  }]);
                  setBubbles(prev => prev.filter(b => b.id !== exactMatch.id));
                  setScore(s => s + 1);
                  setInput(''); 
              }
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, input]);

  // Styles for animations
  const customStyles = `
    @keyframes moveCloud {
        from { transform: translateX(-100%); }
        to { transform: translateX(100vw); }
    }
    @keyframes flyOut {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-60px) scale(0); opacity: 0; }
    }
  `;

  // --- RENDER: MENU ---
  if (gameState === 'menu') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-cyan-200 to-blue-300 relative overflow-hidden select-none">
            <style>{customStyles}</style>
            
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <CloudSVG className="absolute top-20 w-40 text-white animate-[moveCloud_40s_linear_infinite]" style={{left: '-20%'}} />
                <CloudSVG className="absolute top-40 w-64 text-white animate-[moveCloud_60s_linear_infinite]" style={{left: '-10%'}} />
            </div>

            <div className="z-10 text-center mb-10 bg-white/30 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/50">
                <div className="mb-4 animate-bounce drop-shadow-md flex justify-center">
                    <BubbleMenuIconSVG />
                </div>
                <h2 className="text-6xl font-extrabold text-blue-700 drop-shadow-sm mb-2">Bong Bóng Từ Vựng</h2>
                <p className="text-blue-900 font-bold text-xl">Đừng để bong bóng bay mất nhé!</p>
            </div>

            <div className="flex gap-6 z-10">
                {(Object.keys(LEVEL_CONFIG) as Difficulty[]).map(lvl => (
                    <button
                        key={lvl}
                        onClick={() => startGame(lvl)}
                        className={`
                            w-40 py-6 rounded-2xl text-xl font-bold shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105 border-b-4
                            ${lvl === 'easy' ? 'bg-green-400 border-green-600 text-white hover:bg-green-300' : ''}
                            ${lvl === 'normal' ? 'bg-yellow-400 border-yellow-600 text-white hover:bg-yellow-300' : ''}
                            ${lvl === 'hard' ? 'bg-red-400 border-red-600 text-white hover:bg-red-300' : ''}
                        `}
                    >
                        {LEVEL_CONFIG[lvl].label}
                    </button>
                ))}
            </div>

            <button onClick={onExit} className="mt-12 text-blue-700 hover:text-white font-bold z-10 text-lg underline decoration-2 underline-offset-4">Quay lại Menu</button>
        </div>
      );
  }

  // --- RENDER: GAME OVER ---
  if (gameState === 'gameover') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900/95 text-white z-50 animate-in fade-in">
            <h2 className="text-7xl font-extrabold text-pink-500 mb-6 drop-shadow-lg">Hết Mạng Rồi! 😭</h2>
            <div className="bg-white/10 p-10 rounded-[3rem] text-center backdrop-blur-lg border border-white/20 mb-10 shadow-2xl">
                <p className="uppercase text-sm tracking-[0.3em] text-slate-300 mb-2">Điểm số của bạn</p>
                <p className="text-8xl font-black text-yellow-400 drop-shadow-md">{score}</p>
            </div>
            <div className="flex gap-6">
                <button onClick={() => setGameState('menu')} className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/30">Chơi Lại</button>
                <button onClick={onExit} className="bg-slate-700 hover:bg-slate-600 px-10 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105">Thoát</button>
            </div>
        </div>
      );
  }

  // --- RENDER: PLAYING ---
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 cursor-default select-none">
        <style>{customStyles}</style>

        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
             {/* Large moving clouds */}
             <CloudSVG className="absolute top-[10%] w-[400px] text-white animate-[moveCloud_45s_linear_infinite]" style={{ left: '-20%' }} />
             <CloudSVG className="absolute top-[30%] w-[300px] text-white animate-[moveCloud_35s_linear_infinite]" style={{ left: '-15%', opacity: 0.7 }} />
             <CloudSVG className="absolute top-[5%] w-[200px] text-white animate-[moveCloud_60s_linear_infinite]" style={{ left: '-10%', opacity: 0.5 }} />
             
             {/* Floating Particles */}
             <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
             <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-white rounded-full animate-ping opacity-20" style={{ animationDuration: '5s' }}></div>
             <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
        </div>

        {/* HUD */}
        <div className="absolute top-6 left-6 z-40 flex gap-4">
             <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-lg border-2 border-white/50 flex items-center gap-3 transform hover:scale-105 transition-transform">
                 <span className="text-red-500 text-3xl drop-shadow-sm">❤️</span>
                 <span className="text-slate-800 font-black text-3xl">{lives}</span>
             </div>
             <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-lg border-2 border-white/50 flex items-center gap-3 transform hover:scale-105 transition-transform">
                 <span className="text-yellow-500 text-3xl drop-shadow-sm">⭐</span>
                 <span className="text-slate-800 font-black text-3xl">{score}</span>
             </div>
        </div>
        
        <button 
          onClick={() => setGameState('gameover')} 
          className="absolute top-6 right-6 z-40 bg-white/40 hover:bg-red-500 hover:text-white text-slate-700 px-6 py-2 rounded-xl font-bold backdrop-blur-sm border border-white/40 transition-all"
        >
            Kết Thúc
        </button>

        {/* Bubbles */}
        {bubbles.map(b => (
            <div 
                key={b.id}
                className="absolute transition-transform will-change-transform"
                style={{ 
                    left: `${b.x}%`, 
                    top: `${b.y}%`, 
                    transform: 'translate(-50%, -50%)',
                    zIndex: b.word.startsWith(input) && input.length > 0 ? 30 : 20
                }}
            >
                <BubbleSVG word={b.word} colorClass={b.color} typed={input} />
            </div>
        ))}

        {/* Explosions */}
        {explosions.map(ex => (
            <ExplosionEffect key={ex.id} x={ex.x} y={ex.y} color={ex.color} />
        ))}
    </div>
  );
};

export default BubbleGame;
