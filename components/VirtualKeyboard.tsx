
import React from 'react';
import { KEYBOARD_ROWS } from '../constants';
import { Finger, KeyConfig } from '../types';

interface VirtualKeyboardProps {
  activeChar: string;
  pressedKey: string | null;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeChar, pressedKey }) => {
  
  const getKeyColor = (key: KeyConfig) => {
    const isPressed = pressedKey?.toLowerCase() === key.char.toLowerCase() || (pressedKey === ' ' && key.code === 'Space');
    const isActive = activeChar.toLowerCase() === key.char.toLowerCase() || (activeChar === ' ' && key.code === 'Space');

    if (isPressed) return 'bg-yellow-400 border-yellow-600 scale-95 shadow-inner';
    if (isActive) return 'bg-blue-500 text-white border-blue-700 animate-pulse shadow-blue-300/50 shadow-lg z-10';
    
    switch(key.finger) {
      case Finger.LeftPinky: case Finger.RightPinky: return 'bg-red-50 border-red-200';
      case Finger.LeftRing: case Finger.RightRing: return 'bg-orange-50 border-orange-200';
      case Finger.LeftMiddle: case Finger.RightMiddle: return 'bg-yellow-50 border-yellow-200';
      case Finger.LeftIndex: case Finger.RightIndex: return 'bg-green-50 border-green-200';
      case Finger.Thumb: return 'bg-purple-50 border-purple-200';
      default: return 'bg-white border-slate-200';
    }
  };

  return (
    <div className="bg-slate-300/50 p-2 rounded-2xl shadow-xl border-b-4 border-slate-300 max-w-xl mx-auto select-none backdrop-blur-sm transform scale-95">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-1 gap-1">
          {row.map((key, keyIndex) => (
            <div
              key={`${rowIndex}-${keyIndex}`}
              className={`
                h-9 flex items-center justify-center rounded border-b-2 text-[10px] font-bold transition-all duration-75 uppercase
                ${getKeyColor(key)}
              `}
              style={{ width: `${(key.width || 1) * 2}rem` }}
            >
              {key.char === 'Space' ? '' : key.char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
