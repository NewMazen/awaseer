
import React, { useState, useEffect, useRef } from 'react';
import { AppData, GameScore, PlayerCategory, AdventureDoor, QuizQuestion } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition, ConfettiEffect } from '../CommonLayout';

interface GamesPageProps {
  data: AppData;
  onSaveScore: (score: GameScore) => void;
}

const SOUNDS = {
  walk: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  collect: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  ding: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'
};

const WORLD_WIDTH = 3800;
const START_X = 200;
const DOOR_START_X = 700;
const DOOR_SPACING = 380;
const FINISH_LINE_X = 3600;

const VALUE_TOKENS = [
  { id: 1, x: 450, icon: '🍭' },
  { id: 2, x: 900, icon: '⭐' },
  { id: 3, x: 1300, icon: '🎁' },
  { id: 4, x: 1700, icon: '🎈' },
  { id: 5, x: 2100, icon: '🍦' },
  { id: 6, x: 2500, icon: '🎨' },
  { id: 7, x: 2900, icon: '⚽' },
  { id: 8, x: 3300, icon: '👑' },
];

const AnimatedKid: React.FC<{ 
  isWalking: boolean; 
  isSad: boolean; 
  direction: 'left' | 'right';
  message?: string;
}> = ({ isWalking, isSad, direction, message }) => (
  <div className="flex flex-col items-center relative transition-all duration-300 transform-gpu scale-[0.55] sm:scale-[0.8] md:scale-100">
    {message && (
      <div className="absolute -top-14 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-[1rem] shadow-2xl border-[2px] border-emerald-400 font-black text-[9px] md:text-xs whitespace-nowrap animate-bounce z-[100] ring-2 ring-white/50">
        {message}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-r-[2px] border-b-[2px] border-emerald-400 rotate-45"></div>
      </div>
    )}
    <div className={`relative ${isWalking ? 'animate-bounce-fast' : ''} ${isSad ? 'animate-shake' : ''}`}>
      <div className={`transition-transform duration-300 ${direction === 'left' ? 'scale-x-[-1]' : 'scale-x-[1]'}`}>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFD1AA] rounded-full border-[3px] md:border-[4px] border-slate-900 relative shadow-inner overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-3 md:h-4 bg-[#4A2C2A]"></div>
           <div className="absolute top-5 left-3 w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-900 rounded-full"></div>
           <div className="absolute top-5 right-3 w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-900 rounded-full"></div>
        </div>
        <div className="w-14 h-10 md:w-18 md:h-14 bg-emerald-500 rounded-t-[1.5rem] md:rounded-t-[2rem] border-x-[3px] md:border-x-[4px] border-t-[3px] md:border-t-[4px] border-slate-900 -mt-0.5 shadow-md flex items-center justify-center relative">
           <span className="text-[8px] md:text-[10px] font-black text-white/50 tracking-tighter">أواصر</span>
        </div>
        <div className="flex justify-around -mt-1 px-2">
          <div className={`w-2.5 h-4 md:w-4 md:h-6 bg-slate-900 rounded-b-lg ${isWalking ? 'animate-leg-1' : ''}`}></div>
          <div className={`w-2.5 h-4 md:w-4 md:h-6 bg-slate-900 rounded-b-lg ${isWalking ? 'animate-leg-2' : ''}`}></div>
        </div>
      </div>
    </div>
  </div>
);

export const GamesPage: React.FC<GamesPageProps> = ({ data, onSaveScore }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'quiz' | 'memory' | 'adventure'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [playerCategory, setPlayerCategory] = useState<PlayerCategory | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasHeardIntro, setHasHeardIntro] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const walkingIntervalRef = useRef<number | null>(null);

  const [adventureState, setAdventureState] = useState({
    levels: (data.adventureDoors || []).map((d, i) => ({ 
      ...d, 
      id: i, 
      x: DOOR_START_X + (i * DOOR_SPACING), 
      status: 'locked' as 'locked' | 'open' 
    })),
    collectedTokens: [] as number[],
    kinshipPoints: 0,
    childX: START_X,
    isWalking: false,
    direction: 'right' as 'left' | 'right',
    nearestDoorIdx: null as number | null,
    activeChallenge: null as number | null,
    isError: false,
    codeBuffer: '',
    reachedEnd: false
  });

  const [quizState, setQuizState] = useState({ currentIdx: 0, score: 0, answered: false, selected: null as number | null });
  const [memoryState, setMemoryState] = useState({ cards: [] as any[], moves: 0, flipped: [] as number[], matchedCount: 0 });

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => { 
      const a = new Audio(url);
      a.preload = 'auto';
      audioRefs.current[key] = a; 
    });
    const t = setInterval(() => { if (timerActive && (activeGame !== 'adventure' || hasHeardIntro)) setTimer(prev => prev + 1); }, 1000);
    return () => clearInterval(t);
  }, [timerActive, activeGame, hasHeardIntro]);

  const playSnd = (n: keyof typeof SOUNDS) => { 
    const a = audioRefs.current[n]; 
    if (a) { a.currentTime = 0; a.play().catch(() => {}); } 
  };

  const handleStartIntro = () => {
    if (introAudioRef.current) {
      const playPromise = introAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsAudioPlaying(true))
          .catch(() => { setIsAudioPlaying(false); }); 
      }
    }
  };

  const handleIntroEnd = () => {
    setIsAudioPlaying(false);
    setHasHeardIntro(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const nameParts = playerName.trim().split(/\s+/);
    if (nameParts.length < 3) {
      alert("الرجاء كتابة الاسم الثلاثي كاملاً!");
      return;
    }
    if (!playerCategory) {
      alert("الرجاء اختيار الفئة أولاً!");
      return;
    }
    setIsRegistered(true);
    playSnd('click');
  };

  const startAdventure = () => {
    setActiveGame('adventure');
    setTimer(0);
    setTimerActive(true);
    setHasHeardIntro(false);
  };

  const initMemory = () => {
    // جلب الصور من بيانات التطبيق واستبعاد الفراغات
    const userImages = (data.memoryGameImages || []).filter(img => img && img.length > 50);
    if (userImages.length < 2) {
      alert("يجب رفع صورتين على الأقل في لوحة التحكم لتفعيل التحدي!");
      return;
    }
    
    // إنشاء أزواج من الصور
    let pairCards = [...userImages, ...userImages].map((img, i) => ({ 
      id: i, 
      img, 
      flipped: false, 
      matched: false 
    }));
    
    // خلط البطاقات بشكل عشوائي
    pairCards = pairCards.sort(() => Math.random() - 0.5);
    
    setMemoryState({ cards: pairCards, moves: 0, flipped: [], matchedCount: 0 });
    setActiveGame('memory');
    setTimer(0);
    setTimerActive(true);
  };

  const flipCard = (id: number) => {
    if (memoryState.flipped.length === 2) return;
    const card = memoryState.cards[id];
    if (card.flipped || card.matched) return;
    
    playSnd('click');
    const newCards = [...memoryState.cards];
    newCards[id].flipped = true;
    const newFlipped = [...memoryState.flipped, id];
    setMemoryState(prev => ({ ...prev, cards: newCards, flipped: newFlipped }));

    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [id1, id2] = newFlipped;
        if (newCards[id1].img === newCards[id2].img) {
          playSnd('ding');
          newCards[id1].matched = true;
          newCards[id2].matched = true;
          const newMatchedCount = memoryState.matchedCount + 2;
          setMemoryState(p => ({ ...p, cards: newCards, flipped: [], matchedCount: newMatchedCount, moves: p.moves + 1 }));
          if (newMatchedCount === newCards.length) {
            setTimerActive(false);
            playSnd('win');
            setTimeout(() => setShowRegistration(true), 500);
          }
        } else {
          newCards[id1].flipped = false;
          newCards[id2].flipped = false;
          setMemoryState(p => ({ ...p, cards: newCards, flipped: [], moves: p.moves + 1 }));
        }
      }, 800);
    }
  };

  const closeAll = () => { 
    setActiveGame('menu'); 
    setTimerActive(false); 
    setShowRegistration(false); 
    setHasHeardIntro(false);
    if (introAudioRef.current) {
       introAudioRef.current.pause();
       introAudioRef.current.currentTime = 0;
    }
    if (walkingIntervalRef.current) { clearInterval(walkingIntervalRef.current); walkingIntervalRef.current = null; }
  };

  const moveKid = (dir: 'left' | 'right') => {
    if (!hasHeardIntro) return; 
    if (adventureState.activeChallenge !== null) return;
    if (walkingIntervalRef.current) return;
    setAdventureState(p => ({ ...p, isWalking: true, direction: dir }));
    
    walkingIntervalRef.current = window.setInterval(() => {
      setAdventureState(p => {
        const speed = 20;
        let nextX = p.childX + (dir === 'right' ? speed : -speed);
        if (nextX < 50) nextX = 50;
        if (nextX > WORLD_WIDTH) nextX = WORLD_WIDTH;

        let nearestIdx = null;
        p.levels.forEach((door, idx) => {
           if (Math.abs(nextX - door.x) < 55) nearestIdx = idx;
        });

        const reachedFinish = nextX >= FINISH_LINE_X && p.levels.every(l => l.status === 'open');
        let newPoints = p.kinshipPoints;
        let newTokens = [...p.collectedTokens];
        VALUE_TOKENS.forEach(t => {
           if (!newTokens.includes(t.id) && Math.abs(nextX - t.x) < 45) {
              newTokens.push(t.id);
              newPoints += 100;
              playSnd('collect');
           }
        });

        if (reachedFinish && !p.reachedEnd) {
           stopMoving();
           setTimeout(() => { setTimerActive(false); playSnd('win'); setShowRegistration(true); }, 500);
           return { ...p, childX: nextX, reachedEnd: true };
        }

        return { ...p, childX: nextX, nearestDoorIdx: nearestIdx, kinshipPoints: newPoints, collectedTokens: newTokens };
      });
    }, 30);
  };

  const stopMoving = () => {
    if (walkingIntervalRef.current) { clearInterval(walkingIntervalRef.current); walkingIntervalRef.current = null; }
    setAdventureState(p => ({ ...p, isWalking: false }));
  };

  const handleKeypadPress = (num: string) => {
    playSnd('click');
    const activeDoor = adventureState.levels[adventureState.activeChallenge!];
    setAdventureState(p => {
      const newCode = p.codeBuffer + num;
      if (newCode.length === activeDoor.answer.length) {
        if (newCode === activeDoor.answer) {
          setTimeout(() => handleSuccess(), 100);
        } else {
          playSnd('fail');
          setAdventureState(ps => ({ ...ps, isError: true, codeBuffer: '' }));
          setTimeout(() => setAdventureState(ps => ({ ...ps, isError: false })), 500);
        }
      }
      return { ...p, codeBuffer: newCode.slice(0, activeDoor.answer.length) };
    });
  };

  const handleSuccess = () => {
    playSnd('ding');
    const newLevels = [...adventureState.levels];
    newLevels[adventureState.activeChallenge!].status = 'open';
    setAdventureState(p => ({ ...p, levels: newLevels, activeChallenge: null, kinshipPoints: p.kinshipPoints + 500, codeBuffer: '' }));
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizState.answered) return;
    const isCorrect = idx === data.quizQuestions[quizState.currentIdx].correctAnswerIndex;
    if (isCorrect) playSnd('ding'); else playSnd('fail');
    setQuizState(p => ({ ...p, answered: true, selected: idx, score: isCorrect ? p.score + 100 : p.score }));
    setTimeout(() => {
      if (quizState.currentIdx < data.quizQuestions.length - 1) {
        setQuizState(prev => ({ ...prev, currentIdx: prev.currentIdx + 1, answered: false, selected: null }));
      } else {
        setTimerActive(false); playSnd('win'); setShowRegistration(true);
      }
    }, 1500);
  };

  const saveScore = () => {
    let finalScore = 0;
    if (activeGame === 'adventure') finalScore = adventureState.kinshipPoints;
    else if (activeGame === 'quiz') finalScore = quizState.score;
    else if (activeGame === 'memory') finalScore = Math.max(10, 200 - (memoryState.moves * 3));

    onSaveScore({ 
      id: Date.now().toString(), 
      playerName, 
      playerCategory: playerCategory!, 
      gameType: activeGame === 'adventure' ? 'riddleDoors' : (activeGame === 'quiz' ? 'quiz' : 'memory'), 
      score: finalScore, 
      timeInSeconds: timer, 
      date: new Date().toLocaleDateString('ar-SA') 
    });
    closeAll();
  };

  if (!isRegistered) {
    return (
      <div className="pt-32 md:pt-40 container mx-auto px-6 text-center" dir="rtl">
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-2xl border-[10px] border-emerald-100 animate-in zoom-in">
           <div className="text-6xl md:text-8xl mb-6 animate-bounce">🏹</div>
           <h2 className="text-2xl md:text-4xl font-[1000] mb-6 text-emerald-700 dark:text-emerald-400">بوابة التحديات</h2>
           <form onSubmit={handleRegister} className="space-y-6 md:space-y-8">
              <div className="space-y-1 text-right">
                <label className="text-xs font-black text-slate-400 uppercase mr-2 tracking-widest">الاسم الثلاثي</label>
                <input type="text" placeholder="مثلاً: مازن علي مليباري" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-4 border-emerald-500 text-center font-[1000] text-xl md:text-2xl outline-none shadow-inner dark:text-white" required />
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                 {[
                   { id: 'child', label: 'الأشبال', icon: '👶' },
                   { id: 'male', label: 'الرجال', icon: '👨' },
                   { id: 'female', label: 'النساء', icon: '👩' }
                 ].map((cat) => (
                   <button key={cat.id} type="button" onClick={() => setPlayerCategory(cat.id as PlayerCategory)} className={`p-3 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border-4 transition-all flex flex-col items-center gap-1 md:gap-2 ${playerCategory === cat.id ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-xl' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                     <span className="text-2xl md:text-4xl">{cat.icon}</span>
                     <span className="text-[10px] md:text-xs font-black whitespace-nowrap">{cat.label}</span>
                   </button>
                 ))}
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-5 md:py-6 rounded-[2rem] font-[1000] text-xl md:text-2xl shadow-[0_8px_0_#064e3b] active:translate-y-1 transition-all active:shadow-none">دخول 🏹</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      {showRegistration && <ConfettiEffect />}
      <div className="pt-32 md:pt-40 container mx-auto px-4 mb-20 text-right font-sans" dir="rtl">
        <SectionHeader title="ألعاب أواصر" subtitle={`مرحباً بالبطل: ${playerName} ✨`} />

        {activeGame === 'menu' && (
          <div className="max-w-4xl mx-auto px-2">
             {playerCategory === 'child' ? (
               <button onClick={startAdventure} className="group bg-gradient-to-br from-sky-400 to-sky-600 p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] shadow-2xl border-b-[10px] md:border-b-[15px] border-sky-800 w-full text-right transition-all hover:scale-[1.01] active:translate-y-1 active:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-5xl md:text-8xl mb-4">🏃‍♂️</div>
                      <h3 className="text-2xl md:text-5xl font-[1000] text-white mb-2 leading-tight">مرسال حارة الكدوة</h3>
                      <p className="text-sky-100 text-xs md:text-base font-black italic">تحدي الأبواب والبحث عن الكنوز!</p>
                    </div>
                    <div className="text-7xl md:text-[10rem] opacity-20 group-hover:opacity-40 transition-opacity">🏠</div>
                  </div>
               </button>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <button onClick={() => { setActiveGame('quiz'); setTimer(0); setTimerActive(true); }} className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-10 rounded-[3rem] shadow-xl border-b-8 border-emerald-800 text-right transition-all active:translate-y-1">
                    <div className="text-5xl mb-4">🧠</div>
                    <h3 className="text-2xl md:text-3xl font-[1000] text-white">خبير العائلة</h3>
                    <p className="text-emerald-100 text-xs md:text-sm font-black mt-2">اختبر معلوماتك التاريخية!</p>
                 </button>
                 <button onClick={initMemory} className="bg-gradient-to-br from-purple-400 to-purple-600 p-10 rounded-[3rem] shadow-xl border-b-8 border-purple-800 text-right transition-all active:translate-y-1">
                    <div className="text-5xl mb-4">🧩</div>
                    <h3 className="text-2xl md:text-3xl font-[1000] text-white">تحدي الوجوه</h3>
                    <p className="text-purple-100 text-xs md:text-sm font-black mt-2">تذكر صور أعضاء العائلة!</p>
                 </button>
               </div>
             )}
          </div>
        )}

        {/* لعبة مرسال أواصر */}
        {activeGame === 'adventure' && (
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-in slide-in-from-bottom-10 px-1">
             {data.adventureIntroAudioUrl && <audio ref={introAudioRef} src={data.adventureIntroAudioUrl} onEnded={handleIntroEnd} />}
             
             <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-[2rem] md:rounded-[3rem] shadow-xl border-4 border-sky-100">
                <div className="text-center bg-emerald-50 dark:bg-emerald-900/20 p-2 md:p-4 rounded-2xl"><span className="text-[9px] md:text-xs font-black text-emerald-600 block uppercase">الأبواب</span><span className="font-[1000] text-emerald-700 text-lg md:text-2xl">🏠 {adventureState.levels.filter(l => l.status === 'open').length}/8</span></div>
                <div className="text-center bg-amber-50 dark:bg-amber-900/20 p-2 md:p-4 rounded-2xl"><span className="text-[9px] md:text-xs font-black text-amber-600 block uppercase">النقاط</span><span className="font-[1000] text-amber-700 text-lg md:text-2xl">✨ {adventureState.kinshipPoints}</span></div>
                <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-2 md:p-4 rounded-2xl"><span className="text-[9px] md:text-xs font-black text-blue-600 block uppercase">الوقت</span><span className="font-[1000] text-blue-700 text-lg md:text-2xl">⏱️ {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</span></div>
             </div>

             <div className="relative h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-b from-sky-300 to-sky-100 dark:from-slate-950 dark:to-slate-900 rounded-[3rem] md:rounded-[5rem] border-[8px] md:border-[15px] border-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(50% - ${adventureState.childX}px))` }}>
                   <div className="absolute bottom-0 left-[-1000px] h-12 md:h-24 bg-gradient-to-b from-green-500 to-green-700 z-10 w-[6000px] border-t-8 border-green-400"></div>
                   {VALUE_TOKENS.map(t => (
                     <div key={t.id} style={{ left: t.x }} className={`absolute bottom-24 md:bottom-40 transition-all duration-700 ${adventureState.collectedTokens.includes(t.id) ? 'opacity-0 -translate-y-40 scale-0' : 'opacity-100 animate-bounce'}`}>
                        <div className="text-3xl md:text-6xl">{t.icon}</div>
                     </div>
                   ))}
                   {adventureState.levels.map((door, idx) => (
                      <div key={idx} style={{ left: door.x }} className="absolute bottom-12 md:bottom-24 -translate-x-1/2 flex flex-col items-center">
                         <div className={`w-12 h-24 md:w-32 md:h-52 rounded-t-full border-[4px] md:border-[8px] shadow-2xl relative transition-all duration-1000 ${door.status === 'open' ? 'bg-green-100 border-green-500 opacity-50' : 'bg-amber-900 border-amber-950'}`}>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl">{door.status === 'locked' ? '🔒' : '🔓'}</div>
                         </div>
                         <div className={`mt-2 md:mt-4 text-[10px] md:text-xs font-[1000] px-3 py-1 rounded-full shadow-md ${door.status === 'open' ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'}`}>{door.label}</div>
                      </div>
                   ))}
                </div>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                   <div className="mt-40 sm:mt-56 md:mt-72">
                      <AnimatedKid isWalking={adventureState.isWalking} isSad={adventureState.isError} direction={adventureState.direction} message={isAudioPlaying ? 'أستمع... 👂' : (!hasHeardIntro ? 'اضغط للسماع 🎧' : undefined)} />
                   </div>
                </div>
                {!hasHeardIntro && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex flex-col items-center justify-center text-white text-center p-6">
                    <button onClick={handleStartIntro} disabled={isAudioPlaying} className="w-20 h-20 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center text-4xl md:text-8xl shadow-2xl animate-pulse mb-6 ring-8 ring-sky-500/30 text-sky-600 active:scale-95 disabled:opacity-50">
                      {isAudioPlaying ? '🎧' : '▶️'}
                    </button>
                    <h4 className="text-xl md:text-4xl font-[1000]">حكاية حارة الكدوة</h4>
                    <p className="mt-4 text-sm md:text-xl opacity-80">أنصت جيداً للحكاية لتبدأ مغامرتك...</p>
                  </div>
                )}
             </div>

             <div className="grid grid-cols-3 gap-4 md:gap-8 h-24 md:h-48" dir="ltr">
                <button onMouseDown={() => moveKid('left')} onMouseUp={stopMoving} onTouchStart={() => moveKid('left')} onTouchEnd={stopMoving} className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3.5rem] shadow-[0_8px_0_#cbd5e1] flex items-center justify-center text-4xl border-4 border-slate-100 active:translate-y-1 active:shadow-none transition-all">⬅️</button>
                <div className="flex items-center justify-center">
                   {adventureState.nearestDoorIdx !== null && adventureState.levels[adventureState.nearestDoorIdx].status === 'locked' ? (
                      <button onClick={() => { stopMoving(); setAdventureState(p => ({ ...p, activeChallenge: p.nearestDoorIdx })); }} className="w-full h-full bg-emerald-600 text-white font-[1000] rounded-[2rem] md:rounded-[3.5rem] shadow-[0_8px_0_#064e3b] animate-pulse text-xs md:text-2xl border-4 border-white active:translate-y-1 active:shadow-none">افتح الباب! 🔑</button>
                   ) : <button onClick={closeAll} className="text-red-500 font-black text-xs md:text-lg bg-red-50 px-6 py-3 md:py-6 rounded-full border border-red-100">خروج 🚪</button>}
                </div>
                <button onMouseDown={() => moveKid('right')} onMouseUp={stopMoving} onTouchStart={() => moveKid('right')} onTouchEnd={stopMoving} className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3.5rem] shadow-[0_8px_0_#cbd5e1] flex items-center justify-center text-4xl border-4 border-slate-100 active:translate-y-1 active:shadow-none transition-all">➡️</button>
             </div>
          </div>
        )}

        {/* نافذة التحدي (لأبواب المغامرة) */}
        {adventureState.activeChallenge !== null && (
          <div className="fixed inset-0 z-[500] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border-[12px] border-emerald-100 animate-in zoom-in-95" dir="rtl">
                <div className="p-8 text-center">
                   <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">🏠</div>
                   <h3 className="text-2xl font-[1000] text-emerald-700 dark:text-emerald-400 mb-2">{adventureState.levels[adventureState.activeChallenge].label}</h3>
                   <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 mb-8">
                      <p className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-relaxed italic">"{adventureState.levels[adventureState.activeChallenge].riddle}"</p>
                   </div>

                   {adventureState.levels[adventureState.activeChallenge].challengeType === 'code' ? (
                     <div className="space-y-6">
                        <div className="flex justify-center gap-4">
                           {[...Array(adventureState.levels[adventureState.activeChallenge].answer.length)].map((_, i) => (
                              <div key={i} className={`w-12 h-16 md:w-16 md:h-20 rounded-2xl border-4 flex items-center justify-center text-2xl md:text-4xl font-[1000] shadow-inner transition-all ${adventureState.codeBuffer[i] ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-400'}`}>
                                 {adventureState.codeBuffer[i] || '•'}
                              </div>
                           ))}
                        </div>
                        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                           {['1','2','3','4','5','6','7','8','9','0'].map(num => (
                              <button key={num} onClick={() => handleKeypadPress(num)} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-xl md:text-2xl text-slate-800 dark:text-white shadow-md active:scale-95 active:bg-emerald-500 active:text-white transition-all">{num}</button>
                           ))}
                           <button onClick={() => setAdventureState(p => ({ ...p, codeBuffer: '' }))} className="bg-red-50 text-red-500 font-black rounded-2xl active:scale-95">مسح</button>
                        </div>
                     </div>
                   ) : (
                     <div className="grid gap-3">
                        {adventureState.levels[adventureState.activeChallenge].options?.map((opt, i) => (
                           <button key={i} onClick={() => { if (opt === adventureState.levels[adventureState.activeChallenge!].answer) handleSuccess(); else { playSnd('fail'); setAdventureState(p => ({ ...p, isError: true })); setTimeout(() => setAdventureState(p => ({ ...p, isError: false })), 500); } }} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl font-black text-lg hover:bg-emerald-500 hover:text-white transition-all text-right">{opt}</button>
                        ))}
                     </div>
                   )}
                   <button onClick={() => setAdventureState(p => ({ ...p, activeChallenge: null, codeBuffer: '' }))} className="mt-8 text-slate-400 font-black hover:text-red-500 underline">إلغاء المحاولة</button>
                </div>
             </div>
          </div>
        )}

        {/* لعبة خبير العائلة (Quiz) */}
        {activeGame === 'quiz' && (
           <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in px-1">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border-4 border-emerald-100">
                 <div className="text-right"><span className="text-[10px] font-black text-slate-400 block tracking-widest">السؤال</span><span className="font-[1000] text-emerald-600 text-2xl md:text-3xl">{quizState.currentIdx + 1}/{data.quizQuestions.length}</span></div>
                 <div className="text-center"><span className="text-[10px] font-black text-amber-600 block underline tracking-widest">المجموع</span><span className="font-[1000] text-amber-700 text-xl md:text-2xl">✨ {quizState.score}</span></div>
                 <button onClick={closeAll} className="bg-red-50 text-red-500 w-12 h-12 rounded-2xl font-black">✕</button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-x-12 -translate-y-12"></div>
                 <h3 className="text-2xl md:text-4xl font-[1000] text-slate-900 dark:text-white mb-12 leading-tight">
                    {data.quizQuestions[quizState.currentIdx].question}
                 </h3>
                 <div className="grid gap-4">
                    {data.quizQuestions[quizState.currentIdx].options.map((opt, i) => (
                       <button 
                         key={i} 
                         disabled={quizState.answered}
                         onClick={() => handleQuizAnswer(i)}
                         className={`w-full p-6 rounded-[2rem] font-black text-xl transition-all border-4 text-right flex items-center justify-between group ${
                           quizState.answered 
                           ? (i === data.quizQuestions[quizState.currentIdx].correctAnswerIndex ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl scale-105' : (i === quizState.selected ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-50 border-slate-100 opacity-50'))
                           : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-800 dark:text-white shadow-md'
                         }`}
                       >
                         <span>{opt}</span>
                         {quizState.answered && i === data.quizQuestions[quizState.currentIdx].correctAnswerIndex && <span className="text-2xl">✅</span>}
                         {quizState.answered && i === quizState.selected && i !== data.quizQuestions[quizState.currentIdx].correctAnswerIndex && <span className="text-2xl">❌</span>}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* لعبة تحدي الوجوه - تم إصلاح منطق العرض ثلاثي الأبعاد */}
        {activeGame === 'memory' && (
           <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 animate-in zoom-in px-1">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border-4 border-purple-100">
                 <div className="text-right"><span className="text-[10px] font-black text-slate-400 block tracking-widest">المحاولات</span><span className="font-[1000] text-purple-600 text-2xl md:text-3xl">{memoryState.moves}</span></div>
                 <div className="text-center"><span className="text-[10px] font-black text-emerald-600 block underline tracking-widest">تحدي الوجوه</span><span className="font-[1000] text-emerald-700 text-xl md:text-2xl">{memoryState.matchedCount / 2}/{memoryState.cards.length / 2} ✨</span></div>
                 <button onClick={closeAll} className="bg-red-50 text-red-500 w-12 h-12 rounded-2xl font-black">✕</button>
              </div>
              <div className={`grid gap-3 md:gap-6 ${memoryState.cards.length <= 8 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'}`}>
                 {memoryState.cards.map((card, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => flipCard(idx)} 
                      className="aspect-square perspective-1000 cursor-pointer group"
                    >
                       <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${card.flipped || card.matched ? 'rotate-y-180' : ''}`}>
                          {/* الوجه الأمامي (حرف الألف) */}
                          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-purple-500 to-purple-700 rounded-[1.2rem] md:rounded-[2.5rem] border-4 border-white flex items-center justify-center text-white text-4xl md:text-7xl font-black shadow-xl">
                            أ
                          </div>
                          {/* الوجه الخلفي (الصورة) */}
                          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-[1.2rem] md:rounded-[2.5rem] border-4 border-purple-200 overflow-hidden shadow-xl">
                            {card.img ? (
                              <img src={card.img} className="w-full h-full object-cover" alt="face" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">?</div>
                            )}
                            {card.matched && (
                              <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-white drop-shadow-2xl text-4xl md:text-7xl">✓</span>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {showRegistration && (
          <div className="fixed inset-0 z-[600] bg-slate-950/95 flex items-center justify-center p-6 backdrop-blur-3xl">
            <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] border-[15px] border-emerald-500 text-center max-w-sm w-full shadow-2xl animate-in zoom-in">
               <div className="text-7xl md:text-9xl mb-8 animate-tada">🏆</div>
               <h2 className="text-2xl md:text-5xl font-[1000] mb-4 text-emerald-700 dark:text-emerald-400">بطل حقيقي!</h2>
               <p className="text-slate-500 dark:text-slate-400 mb-8 font-black text-lg">لقد اجتزت التحدي ببراعة يا {playerName.split(' ')[0]}</p>
               <button onClick={saveScore} className="w-full bg-emerald-600 text-white py-5 md:py-6 rounded-[2rem] font-[1000] text-xl shadow-[0_8px_0_#064e3b] active:translate-y-2 active:shadow-none transition-all">تسجيل النتيجة ✍️</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce-fast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-fast { animation: bounce-fast 0.2s infinite; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        @keyframes tada {
          0% { transform: scale3d(1, 1, 1); }
          10%, 20% { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); }
          30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }
          40%, 60%, 80% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }
          100% { transform: scale3d(1, 1, 1); }
        }
        .animate-tada { animation: tada 1s infinite; }
      `}</style>
    </PageTransition>
  );
};
