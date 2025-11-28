
import React, { useState, useEffect } from 'react';
import { LESSONS } from './constants';
import { Lesson, TypingStats } from './types';
import TypingArea from './components/TypingArea';
import ReferencePanel from './components/ReferencePanel';
import TypingGame from './components/TypingGame';
import GameMenu from './components/GameMenu';
import SpaceShooterGame from './components/SpaceShooterGame';
import BubbleGame from './components/BubbleGame';
import GuideModal from './components/GuideModal';
import { generatePracticeContent } from './services/geminiService';

type ViewMode = 'menu' | 'lessons' | 'game' | 'ai';
type GameType = 'rain' | 'shooter' | 'bubble' | null;

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [mode, setMode] = useState<ViewMode>('menu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  
  // Game State
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  // Success Modal State
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastStats, setLastStats] = useState<TypingStats | null>(null);

  // Guide Modal State
  const [showGuide, setShowGuide] = useState(false);

  // Group lessons by groupTitle
  const groupedLessons = LESSONS.reduce((acc, lesson) => {
    if (!acc[lesson.groupTitle]) {
      acc[lesson.groupTitle] = [];
    }
    acc[lesson.groupTitle].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleLessonComplete = (stats: TypingStats) => {
    setLastStats(stats);
    setShowSuccess(true);
  };

  // Logic to auto-switch to next lesson
  useEffect(() => {
    let timer: number;
    if (showSuccess && currentLesson) {
        timer = window.setTimeout(() => {
            const currentIndex = LESSONS.findIndex(l => l.id === currentLesson.id);
            if (currentIndex !== -1 && currentIndex < LESSONS.length - 1) {
                const nextLesson = LESSONS[currentIndex + 1];
                setShowSuccess(false);
                setCurrentLesson(nextLesson);
            } else {
                // End of all lessons
                setShowSuccess(false);
                setMode('menu');
                setCurrentLesson(null);
                alert("Chúc mừng! Bạn đã hoàn thành tất cả bài học!");
            }
        }, 2500); // 2.5 seconds delay before switching
    }
    return () => clearTimeout(timer);
  }, [showSuccess, currentLesson]);

  const handleGenerateLesson = async () => {
    if (!customTopic.trim()) return;
    setIsGenerating(true);
    const newLesson = await generatePracticeContent(customTopic);
    setIsGenerating(false);
    if (newLesson) {
      setCurrentLesson(newLesson);
      setMode('lessons');
    } else {
      alert("Không thể tạo bài tập lúc này. Vui lòng thử lại.");
    }
  };

  const renderMainMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 px-6 pb-8">
      {/* Card 1: Study */}
      <button 
        onClick={() => setMode('lessons')}
        className="group relative bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white border-b-8 border-slate-200 hover:border-blue-400 rounded-[2rem] p-8 shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-96 justify-center"
      >
        <div className="text-9xl mb-8 group-hover:scale-110 transition-transform filter drop-shadow-lg">🎓</div>
        <h2 className="text-3xl font-extrabold text-slate-800 group-hover:text-blue-600 mb-3">Luyện Gõ 10 Ngón</h2>
        <p className="text-slate-500 font-medium text-lg">Học bài bản từng bước, từ dễ đến khó.</p>
      </button>

      {/* Card 2: Game */}
      <button 
        onClick={() => { setMode('game'); setSelectedGame(null); }}
        className="group relative bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-white border-b-8 border-slate-200 hover:border-green-400 rounded-[2rem] p-8 shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-96 justify-center"
      >
        <div className="text-9xl mb-8 group-hover:scale-110 transition-transform filter drop-shadow-lg">🎮</div>
        <h2 className="text-3xl font-extrabold text-slate-800 group-hover:text-green-600 mb-3">Trò Chơi</h2>
        <p className="text-slate-500 font-medium text-lg">Vui chơi giải trí với các trò chơi luyện gõ.</p>
      </button>

      {/* Card 3: AI Practice */}
      <button 
        onClick={() => setMode('ai')}
        className="group relative bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-white border-b-8 border-slate-200 hover:border-purple-400 rounded-[2rem] p-8 shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-96 justify-center"
      >
        <div className="text-9xl mb-8 group-hover:scale-110 transition-transform filter drop-shadow-lg">🤖</div>
        <h2 className="text-3xl font-extrabold text-slate-800 group-hover:text-purple-600 mb-3">AI Sáng Tạo</h2>
        <p className="text-slate-500 font-medium text-lg">Tạo bài tập về Siêu nhân, Công chúa...</p>
      </button>
    </div>
  );

  const renderLessonsView = () => (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden bg-white/50 backdrop-blur rounded-t-3xl shadow-2xl mx-2 mt-24 border border-white/50">
      {/* Sidebar List */}
      <div className="w-80 bg-white/80 border-r border-slate-200 flex flex-col z-10 backdrop-blur-xl hidden md:flex">
        <div className="p-5 border-b border-slate-100">
           <button onClick={() => {setMode('menu'); setCurrentLesson(null);}} className="text-slate-500 hover:text-blue-600 flex items-center font-bold text-sm bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-fit mb-3">
             ⬅ Về Trang Chủ
           </button>
           <h2 className="text-2xl font-extrabold text-slate-800">Bài Học</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {Object.entries(groupedLessons).map(([groupTitle, lessons]) => (
            <div key={groupTitle}>
              <h3 className="text-xs uppercase font-extrabold text-blue-500 mb-3 tracking-widest pl-2 border-l-4 border-blue-400">{groupTitle}</h3>
              <div className="space-y-2">
                {lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border-2 relative overflow-hidden group ${
                      currentLesson?.id === lesson.id 
                        ? 'bg-blue-50 border-blue-400 shadow-md' 
                        : 'bg-white border-transparent hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`font-bold text-sm ${currentLesson?.id === lesson.id ? 'text-blue-700' : 'text-slate-700'}`}>{lesson.title}</div>
                    <div className="text-xs opacity-60 mt-1 truncate">{lesson.description}</div>
                    {currentLesson?.id === lesson.id && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-pulse">▶</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-slate-50/50 flex flex-col">
        {currentLesson ? (
          <TypingArea 
            lesson={currentLesson} 
            onComplete={handleLessonComplete} 
            onExit={() => setCurrentLesson(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 select-none">
            <div className="text-9xl mb-4 opacity-30 animate-bounce">👈</div>
            <p className="text-2xl font-bold text-slate-500">Chọn bài học để bắt đầu nào!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderGameView = () => {
    if (selectedGame === 'rain') {
        return <TypingGame onExit={() => setSelectedGame(null)} />;
    }
    if (selectedGame === 'shooter') {
        return <SpaceShooterGame onExit={() => setSelectedGame(null)} />;
    }
    if (selectedGame === 'bubble') {
        return <BubbleGame onExit={() => setSelectedGame(null)} />;
    }
    return <GameMenu onSelectGame={setSelectedGame} onBack={() => setMode('menu')} />;
  };

  const renderAIView = () => (
     <div className="max-w-2xl mx-auto mt-24 px-4">
        <button onClick={() => setMode('menu')} className="mb-6 text-slate-500 hover:text-slate-800 font-bold flex items-center bg-white/50 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
            ⬅ Quay lại
        </button>
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border-4 border-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
            <div className="text-8xl mb-6 animate-pulse">🤖</div>
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">AI Sáng Tạo Bài Tập</h2>
            <p className="text-lg text-slate-600 mb-8">Nhập chủ đề em thích, AI sẽ tạo bài tập ngay!</p>
            
            <div className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  className="flex-1 text-xl px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all shadow-inner"
                  placeholder="Ví dụ: Công chúa Elsa, Siêu nhân..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateLesson()}
                />
                <button 
                  onClick={handleGenerateLesson}
                  disabled={isGenerating || !customTopic}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center"
                >
                  {isGenerating ? <span className="animate-spin mr-2">⏳</span> : '✨'} Tạo Bài
                </button>
            </div>
        </div>
     </div>
  );

  return (
    <div className="h-full flex flex-col font-sans text-slate-800">
      
      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full text-center border-4 border-yellow-300 transform scale-100 animate-bounce-in">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-extrabold text-yellow-500 mb-2">Tuyệt Vời!</h2>
                <p className="text-slate-500 mb-6">Em đã hoàn thành bài học.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-blue-400 uppercase">Tốc độ</div>
                        <div className="text-3xl font-bold text-blue-600">{lastStats?.wpm}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-green-400 uppercase">Chính xác</div>
                        <div className="text-3xl font-bold text-green-600">{lastStats?.accuracy.toFixed(0)}%</div>
                    </div>
                </div>

                <div className="text-slate-400 text-sm font-semibold animate-pulse">
                    Đang chuyển bài tiếp theo... 🚀
                </div>
             </div>
        </div>
      )}

      {/* Header - Only show in Menu or AI mode or if needed globally, but hidden in game to avoid distraction */}
      {mode !== 'game' && (
        <header className="fixed top-0 w-full z-40 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center pointer-events-auto">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setMode('menu')}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-slate-100 group-hover:scale-110 transition-transform text-blue-600">⌨️</div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">
                Go<span className="text-blue-500">10</span>Ngon
              </h1>
            </div>

            {/* Right Side Buttons */}
            <div className="flex gap-3">
                 <button 
                  onClick={() => setShowGuide(true)}
                  className="bg-white hover:bg-yellow-50 text-orange-500 hover:text-orange-600 font-bold px-5 py-2 rounded-full shadow-lg border-2 border-orange-100 flex items-center gap-2 transition-all transform hover:-translate-y-1"
                 >
                    <span className="text-xl">📚</span> Hướng dẫn
                 </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content: Remove top padding in game mode to prevent white gap */}
      <main className={`flex-1 ${mode === 'game' ? 'p-0' : ''}`}>
        {mode === 'menu' && renderMainMenu()}
        {mode === 'lessons' && renderLessonsView()}
        {mode === 'game' && <div className="h-full">{renderGameView()}</div>}
        {mode === 'ai' && renderAIView()}
      </main>

      {/* Hide reference panel in game mode */}
      {mode !== 'game' && <ReferencePanel />}
      
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

export default App;
