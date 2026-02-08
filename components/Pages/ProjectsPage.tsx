
import React from 'react';
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

export const ProjectsPage: React.FC<{ data: AppData }> = ({ data }) => (
  <PageTransition>
    <div className="pt-32 md:pt-40 container mx-auto px-2 md:px-6 text-right mb-40" dir="rtl">
      <SectionHeader 
        title="مشروعي الصغير" 
        subtitle="ندعم ونفتخر بمشاريع أبناء وبنات العائلة الريادية، قصص نجاح بدأت بشغف وتكبر بدعمكم." 
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-7xl mx-auto">
        {data.projects.map(proj => (
          <div 
            key={proj.id} 
            className="bg-white dark:bg-slate-900 p-3 sm:p-6 md:p-8 rounded-[1.2rem] md:rounded-[2.5rem] shadow-lg text-center border-b-[3px] md:border-b-8 border-emerald-600 group relative overflow-hidden hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-emerald-900/10"
          >
            {/* زخرفة خلفية خفيفة */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full -translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-700"></div>
            
            {/* حاوية الشعار المستجيبة */}
            <div className="relative w-14 h-14 md:w-28 md:h-28 mx-auto mb-3 md:mb-6 shadow-xl rounded-[0.8rem] md:rounded-[2rem] overflow-hidden ring-2 md:ring-4 ring-slate-50 dark:ring-slate-800 transition-transform group-hover:rotate-3">
              <img 
                src={proj.logo} 
                className="w-full h-full object-cover" 
                alt={proj.name} 
              />
            </div>

            <div className="space-y-1.5 md:space-y-3">
              <h3 className="text-[10px] sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white transition-colors truncate">
                {proj.name}
              </h3>
              
              <div className="inline-block px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-wider truncate max-w-full">
                {proj.owner}
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-[8px] md:text-sm lg:text-base leading-snug h-auto md:h-20 overflow-hidden transition-colors py-0.5 line-clamp-2 md:line-clamp-3">
                {proj.description}
              </p>
              
              <div className="pt-2">
                <a 
                  href={proj.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-2 md:py-3.5 rounded-md md:rounded-xl font-black text-[8px] md:text-sm lg:text-base shadow-md inline-flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <span>زيارة</span>
                  <span className="text-[10px] md:text-lg">🚀</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.projects.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <p className="text-slate-400 font-bold italic">لا توجد مشاريع مسجلة حالياً.</p>
        </div>
      )}
    </div>
  </PageTransition>
);
