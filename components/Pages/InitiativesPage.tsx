
import React from 'react';
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

export const InitiativesPage: React.FC<{ data: AppData }> = ({ data }) => (
  <PageTransition>
    <div className="pt-32 md:pt-40 container mx-auto px-4 md:px-6 text-right transition-colors mb-40" dir="rtl">
      <SectionHeader 
        title="المبادرات الاجتماعية" 
        subtitle="بصمتنا الوفية في خدمة المجتمع والوطن، توثيقٌ لعطاءات العائلة الممتدة." 
      />
      
      <div className="space-y-10 md:space-y-16 max-w-6xl mx-auto">
        {data.initiatives.map((init, index) => (
          <div 
            key={init.id} 
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-12 items-center bg-white dark:bg-slate-900 p-6 md:p-10 lg:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-100 dark:border-emerald-900/10 group hover:border-emerald-500/20 transition-all duration-500`}
          >
            {/* حاوية الصورة المستجيبة */}
            <div className="lg:w-1/2 w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl aspect-video lg:aspect-auto">
              {init.image ? (
                <img 
                  src={init.image} 
                  className="h-[250px] sm:h-[350px] lg:h-[450px] w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={init.title} 
                />
              ) : (
                <div className="h-[250px] sm:h-[350px] lg:h-[450px] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">💡</div>
              )}
            </div>

            {/* محتوى النص المستجيب */}
            <div className="lg:w-1/2 text-right space-y-4 md:space-y-6">
              <div className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-5 py-1.5 rounded-full font-black text-[10px] md:text-sm tracking-widest transition-colors">
                {init.date}
              </div>
              
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
                {init.title}
              </h3>
              
              <p className="text-sm md:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 transition-colors font-medium">
                {init.description}
              </p>
              
              <div className="h-1 md:h-1.5 w-16 md:w-24 bg-emerald-600 rounded-full group-hover:w-32 transition-all duration-500"></div>
            </div>
          </div>
        ))}

        {data.initiatives.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-bold italic">لا توجد مبادرات مسجلة حالياً.</p>
          </div>
        )}
      </div>
    </div>
  </PageTransition>
);
