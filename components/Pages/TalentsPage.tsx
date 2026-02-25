
import React, { useState } from 'react';
import { AppData, Talent } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

const TalentModal: React.FC<{ talent: Talent; onClose: () => void }> = ({ talent, onClose }) => {
  const isTextType = talent.talentType === 'شعر' || talent.talentType === 'كتابة' || talent.talentType === 'خطابة';

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-2 sm:p-4 md:p-10 backdrop-blur-[20px] bg-slate-950/90 animate-in fade-in duration-500">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 w-full max-w-6xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 relative overflow-hidden flex flex-col md:flex-row max-h-[95vh] sm:max-h-[90vh]" 
        dir="rtl"
      >
        {/* زر الإغلاق */}
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 sm:top-8 sm:left-8 z-[60] w-10 h-10 sm:w-14 sm:h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90"
        >
          <span className="text-xl sm:text-2xl">✕</span>
        </button>

        <div className="w-full md:w-3/5 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden min-h-[250px] md:min-h-0 relative group border-b md:border-b-0 md:border-l border-slate-100 dark:border-slate-800">
          {!isTextType ? (
            <div className="w-full h-full p-4 sm:p-8 md:p-12 overflow-y-auto flex items-center justify-center">
              {talent.content ? (
                <img 
                  src={talent.content} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg" 
                  alt={talent.title} 
                />
              ) : (
                <div className="text-slate-300 italic">لا يوجد محتوى للعرض</div>
              )}
            </div>
          ) : (
            <div className="w-full h-full p-6 sm:p-10 md:p-16 lg:p-24 overflow-y-auto custom-scrollbar flex flex-col items-center bg-gradient-to-br from-purple-50/50 to-transparent dark:from-slate-900">
              <div className="mb-6 sm:mb-10 text-4xl sm:text-6xl opacity-20 animate-pulse">📜</div>
              <div className="max-w-prose w-full">
                <p className={`whitespace-pre-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.8] sm:leading-[2] md:leading-[2.2] text-slate-800 dark:text-purple-50 font-serif text-center selection:bg-purple-500 selection:text-white ${talent.talentType === 'شعر' ? 'italic' : ''}`}>
                  {talent.content}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/5 p-6 sm:p-10 md:p-16 flex flex-col bg-white dark:bg-slate-900 text-right overflow-y-auto">
          <div className="mb-6">
            <span className="bg-purple-600 text-white px-5 py-1.5 rounded-full font-black text-[10px] sm:text-xs inline-block shadow-lg shadow-purple-500/20 tracking-widest mb-4">
              {talent.talentType}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {talent.title}
            </h2>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="relative pr-6">
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-purple-600 rounded-full"></div>
              <h4 className="text-purple-600 dark:text-purple-400 text-[9px] font-black mb-1 uppercase tracking-[0.3em]">بأنامل المبدع/ة</h4>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{talent.owner}</p>
            </div>

            {talent.description && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                <h4 className="text-purple-600 dark:text-purple-400 text-[9px] font-black mb-2 uppercase tracking-[0.3em]">حول هذا العمل</h4>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {talent.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export const TalentsPage: React.FC<{ data: AppData }> = ({ data }) => {
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  
  return (
    <PageTransition>
      <div className="pt-32 md:pt-40 container mx-auto px-2 md:px-6 mb-40 text-right transition-colors" dir="rtl">
        <SectionHeader 
          title="مواهبنا الإبداعية" 
          subtitle="منصة تجمع الفن، الشعر، والفكر لإبداعات متميزة لذرية محي الدين مليباري." 
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {data.talents.map((talent, idx) => {
            const isText = talent.talentType === 'شعر' || talent.talentType === 'كتابة' || talent.talentType === 'خطابة';
            
            return (
              <div 
                key={talent.id} 
                onClick={() => setSelectedTalent(talent)} 
                className="group cursor-pointer relative bg-white dark:bg-slate-900 rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden shadow-md border border-slate-100 dark:border-white/5 hover:border-purple-500/50 transition-all duration-500 transform-gpu active:scale-[0.98] animate-in fade-in slide-in-from-bottom-5"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
              >
                {!isText ? (
                  <div className="h-[140px] sm:h-[240px] md:h-[320px] overflow-hidden relative">
                    {talent.content ? (
                      <img 
                        src={talent.content} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                        alt={talent.title} 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">🖼️</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  </div>
                ) : (
                  <div className="h-[140px] sm:h-[240px] md:h-[320px] p-3 sm:p-8 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/10 flex flex-col justify-center relative overflow-hidden group-hover:bg-purple-100/10 transition-colors">
                    <div className="absolute top-2 right-2 text-2xl opacity-[0.05] rotate-12 transition-transform group-hover:rotate-0 duration-1000 select-none">📜</div>
                    <p className={`line-clamp-3 sm:line-clamp-4 text-[10px] sm:text-base md:text-lg text-slate-800 dark:text-purple-100/80 leading-relaxed italic font-serif transition-all relative z-10 text-center px-1`}>
                      {talent.content}
                    </p>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 pointer-events-none">
                  <div className="flex flex-col gap-0.5 md:gap-1 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="flex items-center gap-1">
                       <span className="bg-purple-600 text-white text-[6px] md:text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-lg">
                        {talent.talentType}
                      </span>
                    </div>
                    <h3 className={`text-[10px] sm:text-base md:text-xl font-black ${!isText ? 'text-white' : 'text-slate-900 dark:text-white'} leading-tight truncate`}>
                      {talent.title}
                    </h3>
                    <div className="flex items-center gap-1">
                       <div className="w-2 h-[1px] bg-purple-500"></div>
                       <p className={`font-black text-[8px] sm:text-xs md:text-sm ${!isText ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'} truncate`}>
                        {talent.owner}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-3 group-hover:translate-x-0 z-30">
                   <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-white text-[10px] shadow-xl">
                     🔍
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTalent && (
        <TalentModal 
          talent={selectedTalent} 
          onClose={() => setSelectedTalent(null)} 
        />
      )}
    </PageTransition>
  );
};
