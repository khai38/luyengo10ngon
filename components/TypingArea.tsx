
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Finger, Lesson, TypingStats } from '../types';
import { KEYBOARD_ROWS, FINGER_NAMES_VI } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';
import HandVisuals from './HandVisuals';

interface TypingAreaProps {
  lesson: Lesson;
  onComplete: (stats: TypingStats) => void;
  onExit: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ lesson, onComplete, onExit }) => {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  
  // New state to hold final stats to prevent flickering/updates after finish
  const [finalStats, setFinalStats] = useState<TypingStats | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLElement>(null); // Ref to track current character

  const targetText = lesson.content;
  const currentIndex = input.length;
  // If finished, don't show active char
  const isFinished = input.length === targetText.length;
  const currentChar = isFinished ? '' : (targetText[currentIndex] || '');
  
  const getActiveFinger = (char: string): Finger | null => {
    if (!char) return null;
    if (char === '\n') {
        return Finger.RightPinky;
    }
    const lowerChar = char.toLowerCase();
    for (const row of KEYBOARD_ROWS) {
      for (const key of row) {
        if (key.char.toLowerCase() === lowerChar || (key.char === 'Space' && char === ' ')) {
          return key.finger;
        }
        if (key.code === 'Enter' && char === '\n') return key.finger;
      }
    }
    return null;
  };

  const activeFinger = getActiveFinger(currentChar);
  const isEnterNext = currentChar === '\n';

  // Determine hint position
  const isLeftHand = activeFinger?.includes('Left');
  const isRightHand = activeFinger?.includes('Right');
  // Thumb hint logic removed

  const calculateStats = useCallback((): TypingStats => {
    if (finalStats) return finalStats;

    const now = endTime || Date.now();
    const timeElapsed = startTime ? (now - startTime) / 60000 : 0;
    const safeTime = timeElapsed === 0 ? 0.001 : timeElapsed; 
    
    const wpm = startTime ? Math.round((input.length / 5) / safeTime) : 0;
    
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== targetText[i]) errors++;
    }

    const accuracy = input.length > 0 ? Math.max(0, 100 - (errors / input.length) * 100) : 100;

    return {
      wpm,
      accuracy,
      errors,
      totalChars: input.length,
      startTime
    };
  }, [input, startTime, endTime, targetText, finalStats]);

  // Effect to trigger completion
  useEffect(() => {
    if (input.length === targetText.length && !finalStats) {
      // Freeze logic
      const endT = Date.now();
      setEndTime(endT);
      
      const timeElapsed = startTime ? (endT - startTime) / 60000 : 0.001;
      const safeTime = timeElapsed === 0 ? 0.001 : timeElapsed;
      const wpm = Math.round((targetText.length / 5) / safeTime);
      
      let errors = 0;
      for (let i = 0; i < input.length; i++) {
          if (input[i] !== targetText[i]) errors++;
      }
      const accuracy = Math.max(0, 100 - (errors / targetText.length) * 100);

      const stats: TypingStats = {
          wpm,
          accuracy,
          errors,
          totalChars: targetText.length,
          startTime
      };

      setFinalStats(stats);
      onComplete(stats);
    }
  }, [input, targetText, startTime, onComplete, finalStats]);

  // Auto-scroll effect
  useEffect(() => {
    if (activeCharRef.current && scrollRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [input.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setPressedKey(e.key);
  };

  const handleKeyUp = () => {
    setPressedKey(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finalStats) return; // Prevent typing after completion

    const val = e.target.value;
    
    if (!startTime) {
        setStartTime(Date.now());
    }
    
    // Allow typing only if length <= target
    if (val.length <= targetText.length) {
      setInput(val);
    }
  };

  // Reset state when lesson changes
  useEffect(() => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setFinalStats(null);
    if(inputRef.current) inputRef.current.focus();
  }, [lesson]);

  const stats = calculateStats();

  return (
    <div className="flex flex-col h-full w-full px-4 pt-4 pb-0 max-w-[95%] mx-auto" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
      
      {/* Floating Finger Hints */}
      {activeFinger && !finalStats && (
         <>
            {isLeftHand && (
              <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
                <div className="bg-blue-100 border-2 border-blue-400 text-blue-800 px-4 py-2 rounded-xl shadow-lg animate-bounce text-center font-bold text-lg">
                   {FINGER_NAMES_VI[activeFinger]}
                   {isEnterNext && <div className="text-xs bg-white/50 rounded mt-1">ENTER</div>}
                </div>
              </div>
            )}
            {isRightHand && (
              <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
                <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-2 rounded-xl shadow-lg animate-bounce text-center font-bold text-lg">
                   {FINGER_NAMES_VI[activeFinger]}
                   {isEnterNext && <div className="text-xs bg-white/50 rounded mt-1">ENTER</div>}
                </div>
              </div>
            )}
         </>
      )}

      <div className="flex justify-between items-center mb-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-lg border-b-4 border-slate-200 shrink-0">
        <button onClick={onExit} className="flex items-center text-slate-500 hover:text-primary font-bold transition-colors bg-slate-100 hover:bg-blue-100 px-4 py-2 rounded-xl">
          <span className="text-xl mr-2">🔙</span> Menu
        </button>
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-700">{lesson.title}</h2>
        </div>
        <div className="flex gap-6 text-base font-mono">
          <div className="flex flex-col items-center bg-blue-50 px-4 py-1 rounded-lg border border-blue-100">
             <span className="text-[10px] uppercase text-blue-400 font-bold">Tốc độ</span>
             <span className="font-bold text-blue-600 text-xl">{stats.wpm} <span className="text-xs">WPM</span></span>
          </div>
          <div className="flex flex-col items-center bg-green-50 px-4 py-1 rounded-lg border border-green-100">
             <span className="text-[10px] uppercase text-green-400 font-bold">Chính xác</span>
             <span className="font-bold text-green-600 text-xl">{stats.accuracy.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-grow overflow-hidden">
          
          <div 
            ref={scrollRef}
            className="bg-yellow-50 p-6 rounded-3xl shadow-md border-2 border-yellow-200 overflow-y-auto min-h-[140px] max-h-[30vh] relative scroll-smooth"
          >
            <div className="absolute top-0 left-0 bg-yellow-200 text-yellow-800 px-4 py-1 rounded-br-xl text-xs font-bold uppercase tracking-widest">
                Văn bản mẫu
            </div>
            <div className="font-mono text-3xl leading-relaxed whitespace-pre-wrap break-words text-slate-300 select-none mt-4 pl-2">
                {targetText.split('').map((char, idx) => {
                    const isCurrent = idx === input.length && !finalStats;
                    const isTyped = idx < input.length;
                    const isCorrect = isTyped && input[idx] === char;
                    
                    let className = "";
                    if (isTyped) {
                        className = isCorrect ? "text-slate-800" : "text-red-500 bg-red-100 rounded";
                    } else if (isCurrent) {
                        className = "bg-blue-500 text-white rounded px-1 animate-pulse shadow-lg shadow-blue-500/50";
                    }

                    if (char === '\n') {
                        return (
                          <React.Fragment key={idx}>
                             <span 
                               className={`${className} inline-block w-8 text-center text-sm align-middle opacity-50`}
                               ref={isCurrent ? activeCharRef : null}
                             >↵</span>
                             <br/>
                          </React.Fragment>
                        );
                    }

                    return <span key={idx} className={className} ref={isCurrent ? activeCharRef : null}>{char}</span>;
                })}
            </div>
          </div>

          <div className="relative flex-grow h-32 shrink-0">
             <div className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full border border-blue-200 text-xs font-bold text-blue-500 uppercase tracking-widest z-10 shadow-sm">
                Nhập văn bản tại đây
             </div>
             <textarea 
                ref={inputRef}
                value={input} 
                onChange={handleChange}
                className="w-full h-full p-6 rounded-3xl border-4 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 shadow-xl font-mono text-3xl leading-relaxed resize-none outline-none text-black bg-white whitespace-pre-wrap placeholder:text-slate-200"
                placeholder={finalStats ? "Đã hoàn thành!" : "Đặt tay lên phím và bắt đầu gõ..."}
                autoComplete="off"
                spellCheck="false"
                readOnly={!!finalStats}
             />
          </div>
      </div>

      <div className="mt-auto shrink-0 relative flex justify-center items-end gap-12 pb-0 transform -translate-y-[50px] transition-transform">
        <div className="hidden xl:block relative z-20 translate-x-[50px]">
          <HandVisuals side="left" activeFinger={isFinished ? null : activeFinger} />
        </div>
        
        <div className="z-30 relative">
          <VirtualKeyboard activeChar={isFinished ? '' : (isEnterNext ? 'Enter' : currentChar)} pressedKey={pressedKey} />
        </div>
        
        <div className="hidden xl:block relative z-20 translate-x-[200px] -translate-y-[20px]">
          <HandVisuals side="right" activeFinger={isFinished ? null : activeFinger} />
        </div>
      </div>
    </div>
  );
};

export default TypingArea;
