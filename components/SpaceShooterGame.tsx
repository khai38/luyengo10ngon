
import React, { useEffect, useState, useRef } from 'react';
import { GAME_WORDS } from '../constants';

interface SpaceShooterGameProps {
  onExit: () => void;
}

type Difficulty = 'easy' | 'normal' | 'hard';
type GameState = 'menu' | 'playing' | 'gameover';
type EnemyType = 'normal' | 'boss';

interface Enemy {
  id: number;
  type: EnemyType;
  word: string;
  wordQueue: string[]; // For Boss: Words coming up next
  maxHp: number;       // For Boss: Total words to type
  currentHp: number;   // For Boss: Remaining words (including current)
  x: number; // Percent 0-100
  y: number; // Percent 0-100
  typedIndex: number;
  speed: number;
  rotation: number; // Angle in degrees
}

interface Projectile {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
}

interface BossProjectile {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number; // Velocity X
  vy: number; // Velocity Y
  rotation: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  size: 'small' | 'large';
  createdAt: number;
}

const LEVEL_CONFIG = {
  easy: { label: 'Dễ', spawnRate: 2500, speed: 0.1, bossSpeed: 0.05 },
  normal: { label: 'Thường', spawnRate: 1800, speed: 0.2, bossSpeed: 0.08 },
  hard: { label: 'Khó', spawnRate: 1200, speed: 0.35, bossSpeed: 0.12 },
};

const PLAYER_POS = { x: 50, y: 90 }; // Player is always at 50% X, 90% Y
const BOSS_SPAWN_THRESHOLD = 20;     // Enemies to spawn before boss
const INITIAL_BOSS_HP = 4;           // Words required for first boss

// --- VISUAL COMPONENTS ---

const PlayerShipSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
      <linearGradient id="cockpitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a5f3fc" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <path d="M45,85 L55,85 L50,98 Z" fill="#f59e0b" className="animate-pulse" />
    <path d="M48,85 L52,85 L50,92 Z" fill="#fef3c7" />
    <path d="M50,20 L90,80 L50,70 L10,80 Z" fill="url(#bodyGrad)" stroke="#1d4ed8" strokeWidth="2" />
    <path d="M50,20 L50,70" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
    <ellipse cx="50" cy="50" rx="6" ry="12" fill="url(#cockpitGrad)" />
    <rect x="20" y="75" width="5" height="15" fill="#3b82f6" rx="1" />
    <rect x="75" y="75" width="5" height="15" fill="#3b82f6" rx="1" />
  </svg>
);

const EnemyShipSVG = ({ isLocked }: { isLocked: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 overflow-visible">
    <defs>
      <radialGradient id="enemyCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={isLocked ? "#fca5a5" : "#d8b4fe"} />
        <stop offset="100%" stopColor={isLocked ? "#dc2626" : "#7e22ce"} />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g transform="rotate(180, 50, 50)">
        <path d="M20,30 L50,0 L80,30 L50,20 Z" fill="#4c1d95" />
        <path d="M10,50 L30,50 L20,80 Z" fill="#581c87" />
        <path d="M90,50 L70,50 L80,80 Z" fill="#581c87" />
        <circle cx="50" cy="50" r="25" fill="url(#enemyCore)" stroke={isLocked ? "#fecaca" : "#e9d5ff"} strokeWidth="2" style={{filter: 'url(#glow)'}} />
        <circle cx="50" cy="50" r="10" fill="#000" />
        <circle cx="50" cy="50" r="4" fill={isLocked ? "#ef4444" : "#22c55e"} className={isLocked ? "animate-ping" : ""} />
    </g>
  </svg>
);

const BossShipSVG = ({ isLocked }: { isLocked: boolean }) => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 overflow-visible drop-shadow-2xl">
    <defs>
       <linearGradient id="bossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="50%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#4c1d95" />
       </linearGradient>
       <filter id="bossGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
             <feMergeNode in="coloredBlur"/>
             <feMergeNode in="SourceGraphic"/>
          </feMerge>
       </filter>
    </defs>
    <g transform="rotate(180, 100, 100)">
       {/* Main Body */}
       <path d="M100,20 L160,80 L140,180 L60,180 L40,80 Z" fill="url(#bossGrad)" stroke="#fbcfe8" strokeWidth="3" />
       {/* Spikes */}
       <path d="M20,60 L60,80 L40,120 Z" fill="#831843" />
       <path d="M180,60 L140,80 L160,120 Z" fill="#831843" />
       {/* Core */}
       <circle cx="100" cy="100" r="30" fill="#000" stroke="#f472b6" strokeWidth="4" />
       <circle cx="100" cy="100" r="15" fill={isLocked ? "#ef4444" : "#f472b6"} className={isLocked ? "animate-pulse" : ""} style={{filter: 'url(#bossGlow)'}} />
       {/* Details */}
       <rect x="90" y="140" width="20" height="30" fill="#db2777" />
    </g>
  </svg>
);

const MissileSVG = () => (
  <svg viewBox="0 0 40 80" className="w-8 h-16 overflow-visible drop-shadow-md">
    <defs>
      <linearGradient id="missileBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
    {/* Flame */}
    <path d="M15,75 Q20,95 25,75" fill="#f59e0b" className="animate-pulse" />
    <path d="M18,75 Q20,85 22,75" fill="#fef3c7" />
    {/* Fins */}
    <path d="M10,65 L5,75 L15,70 Z" fill="#475569" />
    <path d="M30,65 L35,75 L25,70 Z" fill="#475569" />
    {/* Body */}
    <rect x="15" y="10" width="10" height="60" rx="2" fill="url(#missileBody)" />
    {/* Nose */}
    <path d="M15,10 Q20,0 25,10" fill="#ef4444" />
  </svg>
);

// --- MAIN GAME COMPONENT ---

const SpaceShooterGame: React.FC<SpaceShooterGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  
  // Game Logic State
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [activeEnemyId, setActiveEnemyId] = useState<number | null>(null);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [bossBullets, setBossBullets] = useState<BossProjectile[]>([]); // Bullets fired by boss
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  
  // Wave/Boss State
  const [enemiesSpawnedCount, setEnemiesSpawnedCount] = useState(0);
  const [bossWaveLevel, setBossWaveLevel] = useState(0);

  const gameLoopRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);
  
  // Refs to track state inside loop without closure staleness
  const bossPosRef = useRef<{x: number, y: number} | null>(null);
  const lastBossFireTimeRef = useRef<number>(0);
  const nextBossFireIntervalRef = useRef<number>(3000); // Random interval for boss fire

  const startGame = (level: Difficulty) => {
    setDifficulty(level);
    setScore(0);
    setEnemies([]);
    setProjectiles([]);
    setBossBullets([]);
    setExplosions([]);
    setActiveEnemyId(null);
    setEnemiesSpawnedCount(0);
    setBossWaveLevel(0);
    bossPosRef.current = null;
    lastBossFireTimeRef.current = 0;
    nextBossFireIntervalRef.current = 3000;
    setGameState('playing');
  };

  const getRandomWord = () => GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
  const getRandomChar = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const config = LEVEL_CONFIG[difficulty];

    const spawnLogic = () => {
      setEnemies(prev => {
        // If a boss is currently alive, do not spawn normal enemies
        const bossExists = prev.some(e => e.type === 'boss');
        if (bossExists) return prev;

        // Check if we reached the threshold for a boss
        if (enemiesSpawnedCount > 0 && enemiesSpawnedCount % BOSS_SPAWN_THRESHOLD === 0) {
            // SPAWN BOSS
            const currentBossHp = INITIAL_BOSS_HP + bossWaveLevel;
            const wordList = Array.from({ length: currentBossHp }, getRandomWord);
            
            // First word is active, rest are in queue
            const initialWord = wordList[0];
            const queue = wordList.slice(1);

            const boss: Enemy = {
                id: Date.now(),
                type: 'boss',
                word: initialWord,
                wordQueue: queue,
                maxHp: currentBossHp,
                currentHp: currentBossHp,
                x: 50, // Center
                y: -20,
                typedIndex: 0,
                speed: config.bossSpeed,
                rotation: 0
            };
            
            // Increment wave level for next time
            setBossWaveLevel(lvl => lvl + 1);
            setEnemiesSpawnedCount(c => c + 1);

            // Reset fire timer when boss spawns
            lastBossFireTimeRef.current = Date.now();
            nextBossFireIntervalRef.current = 3000;

            return [...prev, boss];
        }

        // SPAWN NORMAL ENEMY
        const word = getRandomWord();
        const startX = Math.random() * 80 + 10;
        
        const newEnemy: Enemy = {
          id: Date.now(),
          type: 'normal',
          word,
          wordQueue: [],
          maxHp: 1,
          currentHp: 1,
          x: startX,
          y: -10,
          typedIndex: 0,
          speed: config.speed + (Math.random() * 0.05),
          rotation: 0
        };

        setEnemiesSpawnedCount(c => c + 1);
        return [...prev, newEnemy];
      });
    };

    spawnRef.current = window.setInterval(spawnLogic, config.spawnRate);

    const loop = () => {
      // 1. Update Enemies & Track Boss Position
      let currentBossPos: {x: number, y: number} | null = null;

      setEnemies(prev => {
        const next = prev.map(e => {
          // VECTOR MATH: Move towards Player
          const dx = PLAYER_POS.x - e.x;
          const dy = PLAYER_POS.y - e.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 1) return e;

          // Normalize and apply speed
          const vx = (dx / distance) * e.speed;
          const vy = (dy / distance) * e.speed;

          const newX = e.x + vx;
          const newY = e.y + vy;

          // Rotation
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;

          if (e.type === 'boss') {
              currentBossPos = { x: newX, y: newY };
          }

          return { 
            ...e, 
            x: newX, 
            y: newY,
            rotation: angle
          };
        });

        // Update Ref synchronously for fire logic
        bossPosRef.current = currentBossPos;

        // Check Enemy Collision
        if (next.some(e => {
            const radius = e.type === 'boss' ? 15 : 6;
            const dist = Math.sqrt(Math.pow(e.x - PLAYER_POS.x, 2) + Math.pow(e.y - PLAYER_POS.y, 2));
            return dist < radius;
        })) {
          setGameState('gameover');
        }

        return next;
      });

      // 2. Boss Fire Logic (Randomized Timer: 3s to 7s)
      if (bossPosRef.current) {
         const now = Date.now();
         if (now - lastBossFireTimeRef.current >= nextBossFireIntervalRef.current) {
             lastBossFireTimeRef.current = now;
             
             // Randomize next interval (3000ms to 7000ms)
             nextBossFireIntervalRef.current = 3000 + Math.random() * 4000;
             
             const bx = bossPosRef.current!.x;
             const by = bossPosRef.current!.y;
             
             // Randomized spread and drop for trajectory variety
             const spread = 0.12 + Math.random() * 0.15; // Random lateral speed
             const drop = 0.02 + Math.random() * 0.08;   // Random drop speed

             // Fire 2 missiles from wings (approx +/- 8% from center with slight jitter)
             const jitter = (Math.random() - 0.5) * 4;

             const leftMissile: BossProjectile = {
                 id: Date.now() + Math.random(),
                 char: getRandomChar(),
                 x: bx - 8 + jitter,
                 y: by,
                 vx: -spread, // Outward left
                 vy: drop,
                 rotation: 0
             };

             const rightMissile: BossProjectile = {
                 id: Date.now() + Math.random() + 1,
                 char: getRandomChar(),
                 x: bx + 8 + jitter,
                 y: by,
                 vx: spread, // Outward right
                 vy: drop,
                 rotation: 0
             };

             setBossBullets(bullets => [...bullets, leftMissile, rightMissile]);
         }
      }

      // 3. Update Boss Bullets (Physics & Homing)
      setBossBullets(bullets => {
          const nextBullets = bullets.map(b => {
              // Vector to player
              const dx = PLAYER_POS.x - b.x;
              const dy = PLAYER_POS.y - b.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 1) return b;
              
              // Acceleration vector (steering towards player)
              // Increased acceleration to allow turning at higher speeds
              const accel = 0.005; 
              const ax = (dx / dist) * accel;
              const ay = (dy / dist) * accel;

              let nextVx = b.vx + ax;
              let nextVy = b.vy + ay;

              // Speed cap (Terminal Velocity) - Increased for difficulty
              const maxSpeed = 0.28;
              const currentSpeed = Math.sqrt(nextVx * nextVx + nextVy * nextVy);
              if (currentSpeed > maxSpeed) {
                  nextVx = (nextVx / currentSpeed) * maxSpeed;
                  nextVy = (nextVy / currentSpeed) * maxSpeed;
              }

              // Update Rotation based on velocity
              const rotation = Math.atan2(nextVy, nextVx) * (180 / Math.PI) + 90;

              return { 
                  ...b, 
                  x: b.x + nextVx, 
                  y: b.y + nextVy,
                  vx: nextVx,
                  vy: nextVy,
                  rotation
              };
          });

          // Check Bullet Collision with Player
          if (nextBullets.some(b => {
              const dist = Math.sqrt(Math.pow(b.x - PLAYER_POS.x, 2) + Math.pow(b.y - PLAYER_POS.y, 2));
              return dist < 4; // Hit radius
          })) {
              setGameState('gameover');
          }
          return nextBullets;
      });


      // 4. Update player projectiles
      setProjectiles(prev => 
        prev.map(p => ({ ...p, progress: p.progress + 0.15 })).filter(p => p.progress < 1)
      );

      // 5. Clear old explosions
      setExplosions(prev => prev.filter(ex => Date.now() - ex.createdAt < 1000));

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnRef.current);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, difficulty, enemiesSpawnedCount, bossWaveLevel]);

  // Handle Typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      const char = e.key.toLowerCase();
      if (char.length !== 1 && char !== ' ') return;

      // 1. DEFENSE PRIORITY: Check if user hit a boss bullet
      let hitBulletId: number | null = null;
      let minBulletDist = Infinity;

      bossBullets.forEach(b => {
          if (b.char === char) {
              const dist = Math.pow(b.x - PLAYER_POS.x, 2) + Math.pow(b.y - PLAYER_POS.y, 2);
              if (dist < minBulletDist) {
                  minBulletDist = dist;
                  hitBulletId = b.id;
              }
          }
      });

      if (hitBulletId) {
          // Destroy bullet
          setBossBullets(prev => prev.filter(b => b.id !== hitBulletId));
          setExplosions(ex => [...ex, { id: Date.now(), x: PLAYER_POS.x, y: PLAYER_POS.y - 10, size: 'small', createdAt: Date.now() }]);
          // Defense successful - consume event (do not shoot enemy)
          // Visual feedback for defense
          setProjectiles(prev => [...prev, {
            id: Date.now(),
            startX: PLAYER_POS.x,
            startY: PLAYER_POS.y,
            targetX: PLAYER_POS.x, // Just visual flash upwards
            targetY: PLAYER_POS.y - 10,
            progress: 0.8
          }]);
          return;
      }

      // 2. OFFENSE: Target Enemies
      let targetId = activeEnemyId;
      let targetEnemy = enemies.find(en => en.id === targetId);

      // Lock on logic
      if (!targetEnemy) {
        const potentialTargets = enemies
          .filter(en => en.word.startsWith(char))
          .sort((a, b) => {
             // Prioritize Boss if both match, otherwise distance
             if (a.type === 'boss' && b.type !== 'boss') return -1;
             if (b.type === 'boss' && a.type !== 'boss') return 1;

             const distA = Math.pow(a.x - PLAYER_POS.x, 2) + Math.pow(a.y - PLAYER_POS.y, 2);
             const distB = Math.pow(b.x - PLAYER_POS.x, 2) + Math.pow(b.y - PLAYER_POS.y, 2);
             return distA - distB;
          });

        if (potentialTargets.length > 0) {
          targetEnemy = potentialTargets[0];
          targetId = targetEnemy.id;
          setActiveEnemyId(targetId);
        }
      }

      if (targetEnemy) {
        const expectedChar = targetEnemy.word[targetEnemy.typedIndex];
        
        if (char === expectedChar) {
          // Fire projectile
          setProjectiles(prev => [...prev, {
            id: Date.now(),
            startX: PLAYER_POS.x,
            startY: PLAYER_POS.y - 5,
            targetX: targetEnemy!.x,
            targetY: targetEnemy!.y,
            progress: 0
          }]);

          setEnemies(prev => prev.map(en => {
            if (en.id === targetId) {
              const newIndex = en.typedIndex + 1;
              
              // Check if word complete
              if (newIndex >= en.word.length) {
                
                // If BOSS
                if (en.type === 'boss') {
                    const newHp = en.currentHp - 1;
                    
                    if (newHp <= 0) {
                        // Boss Dead
                        setScore(s => s + 50 + (en.maxHp * 10));
                        setActiveEnemyId(null);
                        setBossBullets([]); // Clear bullets on win
                        setExplosions(ex => [...ex, { id: Date.now(), x: en.x, y: en.y, size: 'large', createdAt: Date.now() }]);
                        return null; 
                    } else {
                        // Boss Next Word
                        const nextWord = en.wordQueue[0];
                        const remainingQueue = en.wordQueue.slice(1);
                        setExplosions(ex => [...ex, { id: Date.now(), x: en.x, y: en.y, size: 'small', createdAt: Date.now() }]);
                        return {
                            ...en,
                            word: nextWord,
                            wordQueue: remainingQueue,
                            currentHp: newHp,
                            typedIndex: 0 
                        };
                    }
                }

                // If NORMAL Enemy
                setScore(s => s + 10);
                setActiveEnemyId(null);
                setExplosions(ex => [...ex, { id: Date.now(), x: en.x, y: en.y, size: 'small', createdAt: Date.now() }]);
                return null;
              }
              return { ...en, typedIndex: newIndex };
            }
            return en;
          }).filter(Boolean) as Enemy[]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, enemies, activeEnemyId, bossBullets]);


  if (gameState === 'gameover') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white space-y-6 animate-in fade-in">
        <h2 className="text-6xl font-extrabold text-red-500 tracking-wider">GAME OVER</h2>
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 text-center">
            <p className="text-slate-400 text-sm uppercase font-bold">Điểm số cuối cùng</p>
            <p className="text-6xl font-mono font-bold text-yellow-400 mt-2">{score}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setGameState('menu')} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg shadow-blue-500/50">Chơi Lại</button>
          <button onClick={onExit} className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105">Thoát</button>
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white space-y-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        
        <div className="text-center z-10">
            <div className="mb-6 inline-block animate-bounce">
                <PlayerShipSVG />
            </div>
            <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-lg">
                Bảo Vệ Trái Đất
            </h2>
            <p className="text-slate-400 mt-4 text-xl max-w-lg mx-auto leading-relaxed">
                Phi thuyền địch đang lao thẳng vào căn cứ! <br/>
                <span className="text-red-400 block mt-2 font-bold text-sm bg-red-900/20 py-1 rounded">⚠️ CHÚ Ý: Gõ phím trên tên lửa để phá hủy chúng!</span>
            </p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 z-10">
           {(Object.keys(LEVEL_CONFIG) as Difficulty[]).map(lvl => (
               <button 
                key={lvl}
                onClick={() => startGame(lvl)} 
                className={`
                    px-8 py-6 rounded-2xl text-xl font-bold w-48 transition-all transform hover:-translate-y-2 hover:shadow-2xl border-b-4
                    ${lvl === 'easy' ? 'bg-green-600 border-green-800 hover:bg-green-500' : ''}
                    ${lvl === 'normal' ? 'bg-yellow-600 border-yellow-800 hover:bg-yellow-500' : ''}
                    ${lvl === 'hard' ? 'bg-red-600 border-red-800 hover:bg-red-500' : ''}
                `}
               >
                   {LEVEL_CONFIG[lvl].label}
               </button>
           ))}
        </div>

        <button onClick={onExit} className="text-slate-500 hover:text-white underline z-10">Quay lại menu trò chơi</button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-mono select-none cursor-crosshair">
      {/* Dynamic Starfield */}
      <div className="absolute inset-0 z-0">
          <div className="absolute w-full h-full opacity-40" style={{ backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0))', backgroundSize: '200px 200px', animation: 'slideUp 20s linear infinite' }}></div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp { from { background-position: 0 0; } to { background-position: 0 200px; } }
      `}} />

      {/* HUD */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-4">
        <div className="bg-slate-900/80 border border-blue-500/30 px-6 py-2 rounded-xl backdrop-blur-md">
            <span className="text-blue-400 text-sm font-bold block">SCORE</span>
            <span className="text-white text-3xl font-bold tracking-widest">{score}</span>
        </div>
        {/* Wave Progress */}
        <div className="bg-slate-900/80 border border-purple-500/30 px-6 py-2 rounded-xl backdrop-blur-md flex flex-col items-center">
            <span className="text-purple-400 text-xs font-bold block mb-1">NEXT BOSS</span>
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-purple-500 transition-all duration-500"
                   style={{ width: `${(enemiesSpawnedCount % BOSS_SPAWN_THRESHOLD) / BOSS_SPAWN_THRESHOLD * 100}%` }}
                ></div>
            </div>
        </div>
      </div>
      <button onClick={onExit} className="absolute top-4 right-4 z-40 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-red-900/50 px-4 py-2 rounded-lg border border-slate-700 transition-colors">Thoát</button>

      {/* Player Ship */}
      <div 
        className="absolute z-30 transition-all duration-100 ease-out"
        style={{ left: `${PLAYER_POS.x}%`, top: `${PLAYER_POS.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <PlayerShipSVG />
      </div>

      {/* Enemies */}
      {enemies.map(enemy => {
        const isLocked = enemy.id === activeEnemyId;
        const isBoss = enemy.type === 'boss';
        
        return (
          <div 
            key={enemy.id}
            className="absolute flex flex-col items-center justify-center"
            style={{ 
                left: `${enemy.x}%`, 
                top: `${enemy.y}%`, 
                zIndex: isBoss ? 28 : (isLocked ? 25 : 20),
                transform: 'translate(-50%, -50%)' 
            }}
          >
            {/* Health Bar for Boss */}
            {isBoss && (
                <div className="absolute -top-12 flex gap-1 bg-black/50 p-1 rounded">
                    {Array.from({length: enemy.maxHp}).map((_, i) => (
                        <div 
                           key={i} 
                           className={`w-4 h-2 rounded-sm ${i < enemy.currentHp ? 'bg-red-500' : 'bg-slate-600'}`}
                        ></div>
                    ))}
                </div>
            )}

            {/* Ship Graphic */}
            <div style={{ transform: `rotate(${enemy.rotation}deg)`, transition: 'transform 0.1s linear' }}>
                {isBoss ? <BossShipSVG isLocked={isLocked} /> : <EnemyShipSVG isLocked={isLocked} />}
            </div>

            {/* Text Label */}
            <div className={`
              absolute top-full mt-2 whitespace-nowrap px-3 py-1 rounded-lg text-lg font-bold shadow-xl border-2
              ${isLocked ? 'bg-red-600 border-red-400 text-white scale-110' : 'bg-slate-900/90 border-purple-500/50 text-slate-200'}
              ${isBoss ? 'text-2xl px-6 py-2 border-yellow-400 shadow-yellow-500/20' : ''}
            `} style={{ transition: 'all 0.1s' }}>
              <span className="text-green-400 border-b-2 border-green-500">{enemy.word.slice(0, enemy.typedIndex)}</span>
              <span className={isLocked ? 'text-white' : 'text-purple-200'}>{enemy.word.slice(enemy.typedIndex)}</span>
            </div>
            
            {/* Lock Reticle */}
            {isLocked && (
                <div className={`absolute inset-0 border-2 border-red-500 rounded-full animate-ping opacity-50 pointer-events-none ${isBoss ? 'w-[200px] h-[200px] -m-10' : 'w-[120px] h-[120px] -m-5'}`}></div>
            )}
          </div>
        );
      })}

      {/* Boss Missiles */}
      {bossBullets.map(b => (
        <div 
            key={b.id}
            className="absolute z-35 flex items-center justify-center"
            style={{ 
                left: `${b.x}%`, 
                top: `${b.y}%`, 
                transform: 'translate(-50%, -50%)' 
            }}
        >
            <div style={{ transform: `rotate(${b.rotation}deg)` }}>
                <MissileSVG />
            </div>
            {/* High Contrast Text Badge */}
            <div className="absolute bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-slate-300 z-10 pointer-events-none">
                <span className="text-black font-extrabold text-xl font-mono">{b.char.toUpperCase()}</span>
            </div>
        </div>
      ))}

      {/* Projectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id}
          className="absolute z-20 rounded-full blur-[1px]"
          style={{
            width: '4px',
            height: '40px',
            background: 'linear-gradient(to top, rgba(96, 165, 250, 0), #60a5fa, #fff)',
            left: `${p.startX + (p.targetX - p.startX) * p.progress}%`,
            top: `${p.startY + (p.targetY - p.startY) * p.progress}%`,
            transform: `translate(-50%, -50%) rotate(${Math.atan2(p.targetY - p.startY, p.targetX - p.startX) * (180/Math.PI) - 90}deg)`,
            opacity: 1 - p.progress
          }}
        ></div>
      ))}

      {/* Explosions */}
      {explosions.map(ex => (
        <div 
          key={ex.id}
          className="absolute z-50 pointer-events-none"
          style={{ left: `${ex.x}%`, top: `${ex.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className={`relative ${ex.size === 'large' ? 'w-96 h-96' : 'w-40 h-40'}`}>
             <div className="absolute inset-0 bg-white rounded-full animate-[ping_1s_ease-out_forwards] opacity-75"></div>
             <div className={`absolute border-4 ${ex.size === 'large' ? 'border-red-500 inset-4' : 'border-yellow-400 inset-2'} rounded-full animate-[ping_1s_ease-out_forwards]`}></div>
             <div className="absolute inset-0 flex items-center justify-center text-6xl animate-spin duration-1000">💥</div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SpaceShooterGame;
