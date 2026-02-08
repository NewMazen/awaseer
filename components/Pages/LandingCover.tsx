
import React from 'react';
import { AppData } from '../../types';
import { ViewType } from '../Navbar';
import { MediaRenderer } from '../MediaRenderer';

interface LandingProps {
  data: AppData;
  onEnter: (v: ViewType) => void;
  onAdminEnter: () => void;
}

export const LandingCover: React.FC<LandingProps> = ({ data, onEnter, onAdminEnter }) => {
  const colorMap = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    rose: 'text-rose-600'
  };

  const bgLightMap = {
    emerald: 'bg-emerald-50 dark:bg-emerald-900/10',
    amber: 'bg-amber-50 dark:bg-amber-900/10',
    blue: 'bg-blue-50 dark:bg-blue-900/10',
    rose: 'bg-rose-50 dark:bg-rose-900/10'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-700" dir="rtl">
      
      {/* خلفيات متحركة */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-[80px] md:blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-50 dark:bg-amber-900/10 rounded-full blur-[80px] md:blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>

      <header className="container mx-auto px-4 md:px-6 pt-20 md:pt-32 pb-8 relative z-10">
        <div className="w-full h-[1px] bg-slate-900/10 dark:bg-white/10 mb-4"></div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-[10px] md:text-sm font-black text-emerald-600 dark:text-emerald-500 gap-2 text-center md:text-right">
          <span className="order-2 md:order-1">{data.magazineIssue}</span>
          <span className="order-1 md:order-2 text-amber-600 dark:text-amber-500 text-xs md:text-base italic font-serif">
            {data.familySubLabel || 'المجلة الرقمية لذرية محي الدين مليباري'}
          </span>
          <span className="order-3">{data.magazineDate}</span>
        </div>
        <div className="w-full h-[1px] bg-slate-900/10 dark:bg-white/10 mb-6 md:mb-12"></div>
        <h1 className="text-[16vw] md:text-[12vw] font-[900] text-slate-900 dark:text-white leading-none tracking-normal text-center mb-6 select-none">
          {data.magazineTitle}
        </h1>
        <div className="flex items-center justify-center gap-3 md:gap-6">
          <div className="h-[1px] bg-emerald-600/30 flex-grow max-w-[40px] md:max-w-xs"></div>
          <span className="text-base md:text-4xl font-black text-emerald-700 dark:text-emerald-400 tracking-normal whitespace-nowrap px-2">
            {data.familyLabel || 'آل مليباري'}
          </span>
          <div className="h-[1px] bg-emerald-600/30 flex-grow max-w-[40px] md:max-w-xs"></div>
        </div>
        <div className="w-full h-[1px] bg-slate-900/5 dark:bg-white/5 mt-6 md:mt-12"></div>
      </header>

      <main className="flex-grow container mx-auto px-4 md:px-6 py-6 md:py-16 grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        <div className="relative order-2 lg:order-1 flex justify-center">
          <div className="relative group w-full max-w-[240px] md:max-w-sm">
            <div className="absolute -inset-2 bg-emerald-600/20 dark:bg-emerald-600/10 rounded-[2rem] blur-2xl group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative w-full aspect-[3/4] p-2 md:p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 shadow-2xl transform md:rotate-2 hover:rotate-0 transition-all duration-700 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
              <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <MediaRenderer 
                  url={data.founderImage} 
                  className="w-full h-full scale-110 group-hover:scale-100 transition-transform duration-700" 
                  alt="الجد المؤسس" 
                />
              </div>
              <div className="absolute bottom-3 md:bottom-8 right-0 left-0 px-3 md:px-8">
                 <div className="bg-emerald-800/90 backdrop-blur-md p-3 md:p-6 border-r-4 border-amber-500 shadow-2xl">
                    <p className="text-[7px] md:text-xs font-black text-amber-400 uppercase mb-0.5">
                      {data.founderLabel || 'العميد والمؤسس'}
                    </p>
                    <h3 className="text-sm md:text-2xl font-black text-white">{data.founderName}</h3>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right order-1 lg:order-2 px-2">
          <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[9px] md:text-xs font-black mb-4 uppercase">مرحباً بكم في منصتكم</div>
          <h2 className="text-3xl md:text-8xl font-[900] text-slate-900 dark:text-white leading-[1.1] mb-4 tracking-normal">
            {data.heroWelcome}
          </h2>
          <p className="text-sm md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-xl border-r-4 border-emerald-600 pr-3 md:pr-6">
            {data.heroIntro}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6">
            <button onClick={() => onEnter('glory')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg shadow-xl transition-all w-full sm:w-auto">تصفح لوحة المجد</button>
            <button onClick={() => onEnter('about')} className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 text-slate-900 dark:text-white px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto">عن العائلة</button>
          </div>
        </div>
      </main>

      <section className="relative z-20 bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* قسم الإحصائيات المطور للموبايل والكمبيوتر */}
            <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-4 md:gap-12 w-full lg:w-auto">
              {data.stats && data.stats.map((stat, idx) => (
                <React.Fragment key={stat.id}>
                  <div className="flex flex-col items-center md:items-start text-center md:text-right group p-4 md:p-0 rounded-2xl md:rounded-none bg-slate-50/50 dark:bg-white/5 md:bg-transparent transition-all">
                     <span className={`block text-3xl md:text-5xl font-[950] transition-transform duration-500 group-hover:scale-110 ${colorMap[stat.color] || 'text-emerald-600'}`}>
                       {stat.value}
                     </span>
                     <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap mt-1 md:mt-2">
                       {stat.label}
                     </span>
                  </div>
                  {/* فاصل مخفي في الموبايل ليعمل الـ Grid بشكل صحيح */}
                  {idx < data.stats.length - 1 && (
                    <div className="hidden md:block w-[1px] h-12 bg-slate-200 dark:bg-white/10 flex-shrink-0"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <button onClick={onAdminEnter} className="group flex items-center gap-3 md:gap-6 text-right bg-slate-50 dark:bg-slate-900 p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm w-full md:w-auto max-w-sm md:max-w-none">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-950 rounded-xl md:rounded-2xl shadow-md flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:rotate-12 transition-transform">
                  <span className="text-xl md:text-2xl">⚙️</span>
               </div>
               <div>
                  <span className="block text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">إدارة المجلة</span>
                  <span className="block text-sm md:text-base font-black text-slate-800 dark:text-white">بوابة المشرفين</span>
               </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
