

import React, { useState } from 'react';
import { TELEX_RULES, VNI_RULES } from '../constants';

const ReferencePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'telex' | 'vni'>('telex');

  // Helper to clean the text (Remove "Dấu " and examples like "(á)")
  const formatEffect = (text: string) => {
    return text.replace('Dấu ', '').split(' (')[0];
  };

  return (
    <div className={`fixed right-0 top-1/2 -translate-y-1/2 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'}`}>
      <div className="flex items-start">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-white py-3 px-1 rounded-l-md font-bold shadow-lg writing-vertical h-32 flex items-center justify-center hover:bg-blue-600 transition-colors"
          style={{ writingMode: 'vertical-rl' }}
        >
          {isOpen ? 'Đóng' : 'Bảng mã'}
        </button>

        {/* Increased height to h-[90vh] */}
        <div className="bg-white w-52 h-[90vh] shadow-2xl border-l border-slate-200 overflow-y-auto rounded-l-xl p-3">
          <h3 className="font-bold text-2xl mb-4 text-slate-800 text-center">Kiểu gõ</h3>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setMode('telex')} 
              className={`flex-1 py-2 text-lg font-bold rounded ${mode === 'telex' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Telex
            </button>
            <button 
              onClick={() => setMode('vni')} 
              className={`flex-1 py-2 text-lg font-bold rounded ${mode === 'vni' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              VNI
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-2 text-center text-slate-500 text-sm font-semibold">Phím</th>
                <th className="p-2 text-center text-slate-500 text-sm font-semibold">Dấu</th>
              </tr>
            </thead>
            <tbody>
              {(mode === 'telex' ? TELEX_RULES : VNI_RULES).map((rule, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-primary text-2xl text-center">{rule.key}</td>
                  <td className="p-3 text-slate-800 font-bold text-lg text-center capitalize">{formatEffect(rule.effect)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReferencePanel;