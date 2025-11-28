
import React from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-bounce-in border-4 border-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h2 className="text-xl font-extrabold">Hướng Dẫn Gõ 10 Ngón Chuẩn</h2>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body - Reduced padding and spacing */}
        <div className="overflow-y-auto p-6 space-y-4 bg-slate-50">
          
          {/* Section 1: Posture */}
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded-lg text-sm">🪑</span> 1. Tư Thế Ngồi Chuẩn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-1 text-slate-600 text-sm leading-tight">
                <p className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  Lưng thẳng, vuông góc với ghế.
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  Mắt ngang tầm màn hình, cách 50-80cm.
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  Hai chân để phẳng thoải mái trên đất.
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  Cổ tay thả lỏng, không tì chặt cạnh bàn.
                </p>
              </div>
              
              {/* Illustration of Posture */}
              <div className="bg-blue-50 rounded-xl h-48 flex items-center justify-center p-2 border border-blue-100 relative overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  {/* Floor */}
                  <rect x="20" y="180" width="260" height="4" fill="#cbd5e1" rx="2" />

                  {/* Desk */}
                  <rect x="180" y="110" width="100" height="6" fill="#94a3b8" rx="2" /> {/* Top */}
                  <rect x="200" y="116" width="8" height="64" fill="#cbd5e1" /> {/* Leg */}
                  <rect x="260" y="116" width="8" height="64" fill="#cbd5e1" /> {/* Leg */}

                  {/* Monitor */}
                  <rect x="210" y="60" width="50" height="35" fill="#f1f5f9" stroke="#475569" strokeWidth="2" rx="3" />
                  <rect x="215" y="65" width="40" height="25" fill="#e2e8f0" /> {/* Screen */}
                  <path d="M235,95 L235,110" stroke="#475569" strokeWidth="4" /> {/* Stand */}
                  <rect x="225" y="110" width="20" height="3" fill="#475569" /> {/* Base */}

                  {/* Chair */}
                  <path d="M80,110 L80,180" stroke="#64748b" strokeWidth="4" /> {/* Leg */}
                  <path d="M60,180 L100,180" stroke="#64748b" strokeWidth="4" /> {/* Base */}
                  <path d="M80,120 L80,70" stroke="#64748b" strokeWidth="6" strokeLinecap="round" /> {/* Back Support */}
                  <rect x="65" y="120" width="45" height="8" fill="#475569" rx="3" /> {/* Seat */}

                  {/* Person Body */}
                  {/* Leg */}
                  <path d="M120,125 L120,165 L140,165" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" /> 
                  <path d="M90,125 L120,125" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" /> {/* Thigh */}

                  {/* Torso */}
                  <path d="M90,125 L90,75" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
                  
                  {/* Arm */}
                  <path d="M90,85 L115,108 L150,108" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  
                  {/* Hand on Keyboard */}
                  <circle cx="155" cy="108" r="4" fill="#fca5a5" />

                  {/* Head */}
                  <circle cx="92" cy="60" r="14" fill="#fca5a5" />
                  <path d="M92,60 L92,50" stroke="#1e293b" strokeWidth="2" /> {/* Hair hint */}

                  {/* Eye Line Guide */}
                  <path d="M106,60 L210,65" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                  
                  {/* Back Line Guide */}
                  <path d="M78,75 L78,130" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />

                </svg>
              </div>
            </div>
          </section>

          {/* Section 2: Hand Placement */}
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-orange-500 mb-2 flex items-center gap-2">
              <span className="bg-orange-100 p-1 rounded-lg text-sm">🙌</span> 2. Cách Đặt Tay
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-orange-50 rounded-xl p-2 flex flex-col items-center justify-center">
                  <div className="flex gap-4 mb-1 text-xl font-mono font-bold text-slate-700">
                    <span>A</span><span>S</span><span>D</span><span className="text-orange-600 border-b-2 border-orange-600">F</span>
                    <span className="w-6"></span>
                    <span className="text-orange-600 border-b-2 border-orange-600">J</span><span>K</span><span>L</span><span>;</span>
                  </div>
                  <p className="text-xs text-slate-500 text-center">Hai ngón trỏ đặt vào phím có gai (F và J)</p>
               </div>
               <div className="space-y-2 text-slate-600 text-sm leading-tight">
                <div>
                  <p className="font-bold text-xs uppercase text-slate-500">Tay Trái:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Út: <strong>A</strong> | Áp út: <strong>S</strong> | Giữa: <strong>D</strong> | Trỏ: <strong>F</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-xs uppercase text-slate-500">Tay Phải:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Trỏ: <strong>J</strong> | Giữa: <strong>K</strong> | Áp út: <strong>L</strong> | Út: <strong>;</strong></li>
                  </ul>
                </div>
                <p className="text-purple-600 font-bold text-xs mt-1">👍 Hai ngón cái đặt lên phím CÁCH (Space).</p>
              </div>
            </div>
          </section>

          {/* Section 3: Typing Rules */}
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-green-600 mb-2 flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-lg text-sm">⚡</span> 3. Quy Tắc Gõ
            </h3>
            <div className="space-y-2 text-slate-600 text-sm">
               <p className="bg-slate-50 p-2 rounded-lg border-l-4 border-green-500">
                 <strong>Quan trọng:</strong> Mỗi ngón tay chỉ gõ đúng vùng màu quy định.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 leading-tight">
                 <div className="flex items-start gap-2">
                   <span className="text-xl">🔙</span>
                   <p>Gõ xong 1 phím, ngón tay <strong>thu về ngay hàng cơ sở</strong>.</p>
                 </div>
                 <div className="flex items-start gap-2">
                   <span className="text-xl">👀</span>
                   <p>Cố gắng <strong>không nhìn xuống bàn phím</strong>.</p>
                 </div>
               </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-100 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            Sẵn sàng luyện tập 🚀
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuideModal;
