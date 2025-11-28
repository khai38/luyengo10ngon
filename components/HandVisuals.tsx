
import React from 'react';
import { Finger } from '../types';

interface HandVisualsProps {
  activeFinger: Finger | null;
  side: 'left' | 'right';
}

const HandVisuals: React.FC<HandVisualsProps> = ({ activeFinger, side }) => {
  
  const getFingerStyle = (targetFinger: Finger, isLeft: boolean) => {
    const isActive = activeFinger === targetFinger;
    return {
      fill: isActive ? 'url(#activeGradient)' : 'url(#skinGradient)',
      stroke: isActive ? '#2563eb' : '#d4a5a5',
      strokeWidth: isActive ? 2 : 1,
      transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isActive ? 1 : 0.95
    };
  };

  const nailColor = '#fecaca';
  const activeNailColor = '#bfdbfe';

  // Common Finger Component
  const FingerPath = ({ d, nailD, fingerName, isLeft }: { d: string, nailD: string, fingerName: Finger, isLeft: boolean }) => {
     const style = getFingerStyle(fingerName, isLeft);
     const isActive = activeFinger === fingerName;
     return (
       <g style={{ transform: style.transform, transition: style.transition }}>
         <path d={d} fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} />
         <path d={nailD} fill={isActive ? activeNailColor : nailColor} opacity="0.6" />
       </g>
     );
  };

  // Shared Defs
  const Defs = () => (
    <defs>
      <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffdede', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ffc5c5', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.15"/>
      </filter>
    </defs>
  );

  if (side === 'left') {
    return (
      <svg width="240" height="240" viewBox="0 0 200 220" className="transform rotate-6 origin-bottom-right drop-shadow-xl" style={{ filter: 'url(#shadow)' }}>
        <Defs />
        {/* Palm (Left) */}
        <path 
          d="M40,120 L136,120 L136,140 Q150,180 110,210 L60,210 Q20,180 30,150 Z" 
          fill="url(#skinGradient)" 
          stroke="#d4a5a5" 
          strokeWidth="1"
        />

        {/* Fingers */}
        <FingerPath 
          isLeft={true} fingerName={Finger.LeftPinky} 
          d="M40,121 L40,75 Q40,65 52,65 Q64,65 64,75 L64,121 Z"
          nailD="M46,72 Q52,68 58,72 L58,80 Q52,84 46,80 Z"
        />
        <FingerPath 
           isLeft={true} fingerName={Finger.LeftRing} 
           d="M64,121 L64,55 Q64,45 76,45 Q88,45 88,55 L88,121 Z"
           nailD="M70,52 Q76,48 82,52 L82,60 Q76,64 70,60 Z"
        />
        <FingerPath 
           isLeft={true} fingerName={Finger.LeftMiddle} 
           d="M88,121 L88,45 Q88,35 100,35 Q112,35 112,45 L112,121 Z"
           nailD="M94,42 Q100,38 106,42 L106,50 Q100,54 94,50 Z"
        />
        <FingerPath 
           isLeft={true} fingerName={Finger.LeftIndex} 
           d="M112,121 L112,55 Q112,45 124,45 Q136,45 136,55 L136,121 Z"
           nailD="M118,52 Q124,48 130,52 L130,60 Q124,64 118,60 Z"
        />

        {/* Thumb (Left) */}
        <FingerPath 
           isLeft={true} fingerName={Finger.Thumb} 
           d="M136,130 Q160,135 170,125 Q185,130 175,150 Q160,165 136,155 Z"
           nailD="M165,130 Q172,132 170,140 L165,142 Q160,135 165,130 Z"
        />
      </svg>
    );
  }

  return (
    <svg width="240" height="240" viewBox="0 0 200 220" className="transform -scale-x-100 -rotate-6 origin-bottom-left drop-shadow-xl" style={{ filter: 'url(#shadow)' }}>
       <Defs />
       {/* Palm */}
       <path 
        d="M40,120 L136,120 L136,140 Q150,180 110,210 L60,210 Q20,180 30,150 Z" 
        fill="url(#skinGradient)" 
        stroke="#d4a5a5" 
        strokeWidth="1"
      />

      <FingerPath 
        isLeft={false} fingerName={Finger.RightPinky} 
        d="M40,121 L40,75 Q40,65 52,65 Q64,65 64,75 L64,121 Z"
        nailD="M46,72 Q52,68 58,72 L58,80 Q52,84 46,80 Z"
      />
      <FingerPath 
         isLeft={false} fingerName={Finger.RightRing} 
         d="M64,121 L64,55 Q64,45 76,45 Q88,45 88,55 L88,121 Z"
         nailD="M70,52 Q76,48 82,52 L82,60 Q76,64 70,60 Z"
      />
      <FingerPath 
         isLeft={false} fingerName={Finger.RightMiddle} 
         d="M88,121 L88,45 Q88,35 100,35 Q112,35 112,45 L112,121 Z"
         nailD="M94,42 Q100,38 106,42 L106,50 Q100,54 94,50 Z"
      />
      <FingerPath 
         isLeft={false} fingerName={Finger.RightIndex} 
         d="M112,121 L112,55 Q112,45 124,45 Q136,45 136,55 L136,121 Z"
         nailD="M118,52 Q124,48 130,52 L130,60 Q124,64 118,60 Z"
      />
      {/* Thumb (Right hand mirror) */}
      <FingerPath 
         isLeft={false} fingerName={Finger.Thumb} 
         d="M136,130 Q160,135 170,125 Q185,130 175,150 Q160,165 136,155 Z"
         nailD="M165,130 Q172,132 170,140 L165,142 Q160,135 165,130 Z"
      />
    </svg>
  );
};

export default HandVisuals;
