
import React, { useRef, useState, useEffect } from 'react';
import { AppData, AchievementType, Achievement } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition, ConfettiEffect } from '../CommonLayout';

const GlorySection: React.FC<{
  title: string;
  watermark: string;
  theme: 'gold' | 'silver' | 'bronze';
  icon: React.ReactNode;
  achievements: Achievement[];
  description: string;
  tag: string;
}> = ({ title, watermark, theme, icon, achievements, description, tag }) => {
  if (achievements.length === 0) return null;

  const themeStyles = {
    gold: { text: "text-amber-600 dark:text-amber-500", border: "border-amber-200 dark:border-amber-500/30", glow: "bg-amber-500", badge: "bg-amber-600 dark:bg-amber-500", gradient: "from-amber-100 dark:from-amber-500/10" },
    silver: { text: "text-slate-600 dark:text-slate-300", border: "border-slate-200 dark:border-slate-400/30", glow: "bg-slate-400", badge: "bg-slate-600 dark:bg-slate-400", gradient: "from-slate-100 dark:from-slate-400/10" },
    bronze: { text: "text-orange-700 dark:text-orange-600", border: "border-orange-100 dark:border-orange-800/30", glow: "bg-orange-800", badge: "bg-orange-700 dark:bg-orange-800", gradient: "from-orange-50 dark:from-orange-800/10" }
  }[theme];

  return (
    <div className="mb-20">
      <div className={`relative py-12 px-6 bg-gradient-to-br ${themeStyles.gradient} via-white dark:via-slate-900 to-transparent rounded-[3rem] border ${themeStyles.border} overflow-hidden shadow-2xl transition-all`}>
        <div className={`absolute top-0 right-0 p-4 ${themeStyles.text} text-[8rem] font-black opacity-[0.05] dark:opacity-[0.03] select-none pointer-events-none transform translate-x-1/4 -translate-y-1/4`}>
          {watermark}
        </div>
        
        <div className="flex flex-col items-center mb-12 relative z-10 text-center">
          <div className={`w-16 h-16 ${themeStyles.glow} rounded-2xl flex items-center justify-center text-white dark:text-slate-950 shadow-2xl mb-4`}>
            {icon}
          </div>
          <h2 className={`text-3xl md:text-5xl font-black ${themeStyles.text} mb-3 tracking-normal transition-colors`}>
            {title}
          </h2>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl italic px-4 transition-colors tracking-normal">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {achievements.map((person) => (
            <div key={person.id} className="group relative">
              <div className={`h-full relative bg-white/70 dark:bg-slate-950/50 backdrop-blur-md p-6 rounded-[2rem] border ${themeStyles.border} text-center flex flex-col items-center transition-all duration-500 hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-2xl`}>
                <div className="relative mb-4">
                  <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${themeStyles.border} shadow-lg group-hover:scale-105 transition-all`}>
                    <img 
                      src={person.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200"} 
                      className="w-full h-full object-cover" 
                      alt={person.name} 
                    />
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-normal">
                  {person.name}
                </h3>
                <span className={`${themeStyles.badge} text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-normal mb-3`}>
                  {tag}
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3 transition-colors tracking-normal">
                  {person.description}
                </p>
                <div className={`mt-auto pt-3 border-t border-slate-200 dark:border-slate-800/50 w-full text-sm italic ${themeStyles.text} font-black opacity-80 tracking-normal`}>
                  {person.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HallOfGloryPage: React.FC<{ data: AppData }> = ({ data }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // We attempt to play, but most browsers require interaction. 
    // If it fails, we keep isPlaying as false.
    if (audioRef.current && data.gloryMusicUrl) {
      audioRef.current.volume = 0.35;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.warn("Background music autoplay was blocked. Waiting for user interaction.");
            setIsPlaying(false);
          });
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [data.gloryMusicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error toggling play:", err));
      }
    }
  };

  const filter = (type: AchievementType) => data.achievements.filter(a => a.type === type);

  return (
    <PageTransition>
      <ConfettiEffect />
      <audio ref={audioRef} src={data.gloryMusicUrl} loop />
      <div className="fixed bottom-8 right-8 z-[150]">
        <button onClick={togglePlay} className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${isPlaying ? 'bg-emerald-600' : 'bg-amber-500'}`}>
          {isPlaying ? <span className="text-white text-xl">⏸</span> : <span className="text-slate-950 text-xl">▶</span>}
        </button>
      </div>
      <div className="pt-40 container mx-auto px-6 mb-40 text-right" dir="rtl">
        <SectionHeader title="لوحة المجد" subtitle="سجل الفخر لذرية محي الدين مليباري، حيث تخلد الإنجازات وتكرم الهمم العالية." />
        <GlorySection title="سدنة العلم: الدكاترة" watermark="PHD" theme="gold" tag="ELITE" achievements={filter(AchievementType.PHD)} description="نحتفي بكوكبة النخبة الذين ارتقوا في درجات العلم ليكونوا منارات هدى وفخر للعائلة." icon="🎓" />
        <GlorySection title="فرسان المعرفة: الماجستير" watermark="MA" theme="silver" tag="SCHOLAR" achievements={filter(AchievementType.MASTERS)} description="جدارة أكاديمية متميزة تجسد طموح العائلة المتجدد." icon="📜" />
        <GlorySection title="سفراء العلم: البكالوريوس" watermark="BA" theme="bronze" tag="GRAD" achievements={filter(AchievementType.BACHELORS)} description="بكل فخر نهنئ أبناءنا خريجي الجامعات." icon="🎖️" />
        <GlorySection title="رواد المهن: الدبلوم" watermark="DIP" theme="bronze" tag="PROF" achievements={filter(AchievementType.DIPLOMA)} description="كفاءات فنية تساهم في بناء المستقبل." icon="🛠️" />
        <GlorySection title="نجوم الغد: الثانوية" watermark="HS" theme="bronze" tag="STAR" achievements={filter(AchievementType.HIGH_SCHOOL)} description="أولى خطوات النجاح الكبير." icon="🌟" />
        <GlorySection title="وسام الوفاء: المتقاعدون" watermark="RET" theme="gold" tag="HONOR" achievements={filter(AchievementType.RETIREE)} description="مسيرة عطاء حافلة نستلهم منها الحكمة." icon="🏛️" />
        <GlorySection title="التميز الفردي: إنجازات" watermark="ACH" theme="silver" tag="SPECIAL" achievements={filter(AchievementType.INDIVIDUAL)} description="تكريم للمبدعين في مختلف المجالات." icon="💎" />
      </div>
    </PageTransition>
  );
};
