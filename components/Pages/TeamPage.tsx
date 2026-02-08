
import React from 'react';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';
import { AppData } from '../../types';

export const TeamPage: React.FC<{ data: AppData }> = ({ data }) => {
  const teamData = data.teamData || {
    title: 'فريق العمل',
    subtitle: 'كوكبة من المبدعين سخروا جهودهم لخدمة العائلة وبناء هذا الصرح الرقمي.',
    footerNote: 'كل الشكر والتقدير لكل من ساهم ولو بكلمة في نجاح هذا العمل.',
    leader1: { name: 'مازن مليباري', role: 'البرمجة والتنفيذ التقني', description: 'مهندس المنصة والمطور الرئيسي لنظام أواصر الرقمي.' },
    leader2: { name: 'سميرة مليباري', role: 'الإشراف والتنسيق العام', description: 'الإدارة العامة وتنسيق الجهود بين كافة فرق العمل العائلية.' },
    contentTeam: []
  };

  return (
    <PageTransition>
      <div className="pt-40 container mx-auto px-6 mb-40 text-right font-sans relative" dir="rtl">
        
        {/* هالات خلفية ناعمة لتعزيز الجمالية البصرية */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

        <SectionHeader 
          title={teamData.title} 
          subtitle={teamData.subtitle} 
        />

        <div className="max-w-6xl mx-auto space-y-32">
          
          {/* قسم قيادة المشروع - تصميم فاخر بألوان زاهية وشفافية زجاجية */}
          <div className="grid md:grid-cols-2 gap-12 relative">
            
            {/* القائد التقني - ثيم الزمرد الناعم والسيان المضيء */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-300 rounded-[4rem] blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-12 md:p-16 rounded-[4rem] shadow-2xl border border-white/40 dark:border-white/5 flex flex-col h-full overflow-hidden transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-emerald-500/20">
                
                {/* أيقونة خلفية زخرفية */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center text-4xl mb-10 shadow-inner ring-1 ring-emerald-100 dark:ring-emerald-800/50 group-hover:rotate-12 transition-transform duration-500">
                    💻
                  </div>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                       <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-[0.2em]">
                        {teamData.leader1.role || 'القيادة التقنية'}
                       </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                      {teamData.leader1.name}
                    </h3>
                    <div className="w-16 h-1.5 bg-gradient-to-l from-emerald-500 to-transparent rounded-full group-hover:w-32 transition-all duration-700"></div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                      {teamData.leader1.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto pt-12 flex items-center justify-between border-t border-emerald-500/10">
                   <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-[0.3em]">Master Architect</span>
                   <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400/30"></div>)}
                   </div>
                </div>
              </div>
            </div>

            {/* القائد الإداري - ثيم الشامبين والكهرمان الملكي */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-300 rounded-[4rem] blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-12 md:p-16 rounded-[4rem] shadow-2xl border border-white/40 dark:border-white/5 flex flex-col h-full overflow-hidden transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-amber-500/20">
                
                {/* أيقونة خلفية زخرفية */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-[2rem] flex items-center justify-center text-4xl mb-10 shadow-inner ring-1 ring-amber-100 dark:ring-amber-800/50 group-hover:-rotate-12 transition-transform duration-500">
                    📋
                  </div>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 bg-amber-500/10 px-5 py-2 rounded-full border border-amber-500/20">
                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                       <span className="text-amber-700 dark:text-amber-400 font-black text-xs uppercase tracking-[0.2em]">
                        {teamData.leader2.role || 'الإشراف العام'}
                       </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                      {teamData.leader2.name}
                    </h3>
                    <div className="w-16 h-1.5 bg-gradient-to-l from-amber-500 to-transparent rounded-full group-hover:w-32 transition-all duration-700"></div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                      {teamData.leader2.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-12 flex items-center justify-between border-t border-amber-500/10">
                   <span className="text-[10px] font-black text-amber-600/50 uppercase tracking-[0.3em]">General Director</span>
                   <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/30"></div>)}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* فريق الإنتاج - تصميم شبكي عصري وهادئ */}
          <div className="space-y-16">
            <div className="flex items-center gap-8">
               <div className="h-12 w-2 bg-gradient-to-b from-emerald-500 to-amber-500 rounded-full"></div>
               <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">نجوم الإنتاج والمحتوى</h3>
               <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamData.contentTeam && teamData.contentTeam.map((member, idx) => (
                <div 
                  key={member.id} 
                  className="bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="flex flex-col h-full gap-8">
                    <div className="flex justify-between items-start">
                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                        👤
                       </div>
                       <span className="text-slate-100 dark:text-slate-800 font-black text-4xl group-hover:text-emerald-500/10 transition-colors">0{idx + 1}</span>
                    </div>
                    <div className="space-y-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest block border-r-2 border-emerald-500 pr-3">
                        {member.role || 'عضو الفريق'}
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* نص الشكر والوفاء الختامي */}
          <div className="text-center pt-20 border-t border-slate-100 dark:border-slate-800/50">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-5xl opacity-20">❝</div>
              <p className="text-slate-400 dark:text-slate-600 italic font-black text-2xl md:text-3xl leading-loose">
                {teamData.footerNote}
              </p>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-12 h-0.5 bg-emerald-100 dark:bg-emerald-900/30"></div>
                 <div className="text-emerald-500">❤️</div>
                 <div className="w-12 h-0.5 bg-emerald-100 dark:bg-emerald-900/30"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
