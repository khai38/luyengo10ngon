
import React from 'react';

interface GameMenuProps {
  onSelectGame: (game: 'rain' | 'shooter' | 'bubble') => void;
  onBack: () => void;
}

const BubbleIconSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
     <circle cx="35" cy="60" r="25" fill="#22d3ee" fillOpacity="0.6" />
     <circle cx="75" cy="40" r="20" fill="#f472b6" fillOpacity="0.6" />
     <circle cx="50" cy="20" r="12" fill="#a78bfa" fillOpacity="0.6" />
     {/* Highlights */}
     <path d="M28,53 A 12 12 0 0 1 42,53" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
     <path d="M70,35 A 8 8 0 0 1 80,35" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
  </svg>
);

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Chọn Trò Chơi Luyện Gõ</h2>
        <p className="text-slate-500 text-lg">Vừa chơi vừa học, nâng cao tốc độ!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
        {/* Game 1: Rain Words */}
        <button 
          onClick={() => onSelectGame('rain')}
          className="group relative bg-white hover:bg-blue-50 border-4 border-slate-100 hover:border-blue-400 rounded-3xl p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-80 justify-between"
        >
          <div className="mt-4 text-7xl group-hover:scale-110 transition-transform">🌧️</div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 mb-2">Mưa Từ Vựng</h3>
            <p className="text-slate-500 text-sm">Gõ nhanh các từ trước khi chúng rơi xuống đất.</p>
          </div>
          <span className="w-full py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-bold">Chơi Ngay ➡</span>
        </button>

        {/* Game 2: Space Shooter */}
        <button 
          onClick={() => onSelectGame('shooter')}
          className="group relative bg-slate-900 hover:bg-slate-800 border-4 border-slate-700 hover:border-purple-400 rounded-3xl p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-80 justify-between"
        >
          <div className="mt-4 text-7xl group-hover:scale-110 transition-transform">🚀</div>
          <div>
             <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 mb-2">Bảo Vệ Trái Đất</h3>
             <p className="text-slate-400 text-sm">Bắn phá các phi thuyền từ ngữ xâm lăng.</p>
          </div>
          <span className="w-full py-2 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/50">Chiến Đấu ➡</span>
        </button>

        {/* Game 3: Bubble Words */}
        <button 
          onClick={() => onSelectGame('bubble')}
          className="group relative bg-gradient-to-b from-cyan-50 to-pink-50 hover:from-cyan-100 hover:to-pink-100 border-4 border-white hover:border-pink-300 rounded-3xl p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-80 justify-between"
        >
          <div className="mt-4 group-hover:scale-110 transition-transform drop-shadow-md">
            <BubbleIconSVG />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-pink-500 mb-2">Bong Bóng</h3>
            <p className="text-slate-500 text-sm">Gõ từ để làm vỡ bóng trước khi bay mất!</p>
          </div>
          <span className="w-full py-2 bg-pink-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-400/30">Bắt Đầu ➡</span>
        </button>
      </div>

      <button 
        onClick={onBack}
        className="mt-12 text-slate-400 hover:text-slate-600 font-bold flex items-center px-6 py-3 rounded-full hover:bg-slate-100 transition-colors shrink-0"
      >
        ⬅ Quay lại Menu chính
      </button>
    </div>
  );
};

export default GameMenu;
