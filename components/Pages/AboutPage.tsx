
import React from 'react';
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';
import { MediaRenderer } from '../MediaRenderer';

export const AboutPage: React.FC<{ data: AppData }> = ({ data }) => {
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = data.featuredYouTubeUrl ? getYouTubeId(data.featuredYouTubeUrl) : null;

  return (
    <PageTransition>
      <div className="pt-40 container mx-auto px-6 max-w-6xl text-right transition-colors mb-40" dir="rtl">
        <SectionHeader title="عن العائلة والجذور" subtitle="تاريخ ممتد من العطاء في أطهر بقاع الأرض." />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative group flex justify-center">
            <div className="absolute -inset-4 bg-emerald-500 rounded-[3rem] blur-3xl opacity-10 dark:opacity-20"></div>
            <div className="relative rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl ring-1 ring-emerald-500/30 transition-colors w-full max-w-[450px]">
              {data.founderImage ? (
                <img 
                  src={data.founderImage} 
                  className="w-full h-auto max-h-[600px] object-contain md:object-cover" 
                  alt="Founder" 
                />
              ) : (
                <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">No Image</div>
              )}
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-6 underline decoration-amber-500 decoration-4 underline-offset-8 transition-colors">نشأة العائلة</h3>
            <p className="text-xl leading-loose text-slate-700 dark:text-slate-300 mb-8 whitespace-pre-wrap transition-colors font-medium text-justify">{data.founderBio}</p>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-emerald-900/20 shadow-lg">
              <h4 className="text-emerald-700 dark:text-emerald-500 font-black mb-2 tracking-wider uppercase text-xs text-right">إرث باقٍ من مكة المكرمة</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic text-right">
                "نستحضر سيرة الجد {data.founderName}، الذي جعل من القيم النبيلة والترابط الأسري أساساً لبناء هذه الأسرة الكريمة."
              </p>
            </div>
          </div>
        </div>

        <div className="mb-32">
          <div className="bg-white dark:bg-slate-900/40 p-8 md:p-16 rounded-[4rem] shadow-xl border border-slate-200 dark:border-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-x-12 -translate-y-12"></div>
            <div className="inline-block px-4 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">قصة هذا العدد</div>
            <h3 className="text-4xl md:text-5xl font-black mb-10 leading-tight text-slate-900 dark:text-white border-r-8 border-emerald-600 pr-6">
              {data.featuredStoryTitle}
            </h3>
            <div className="flex flex-col md:flex-row gap-10">
               <div className="w-full md:w-1/2 flex-shrink-0">
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform md:rotate-2 hover:rotate-0 transition-transform duration-700 aspect-video md:aspect-auto">
                    {data.featuredStoryImage ? (
                      <img 
                        src={data.featuredStoryImage} 
                        className="w-full h-full object-cover md:object-contain bg-slate-100 dark:bg-slate-950" 
                        alt="Story Cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </div>
               </div>
               <p className="text-xl text-slate-700 dark:text-slate-300 leading-[2] font-medium whitespace-pre-wrap text-justify">
                 {data.featuredStoryText}
               </p>
            </div>
            <div className="mt-12 h-1.5 w-24 bg-amber-500 rounded-full"></div>
          </div>
        </div>

        {videoId && (
          <div className="mb-32">
             <div className="flex items-center gap-6 mb-12">
               <div className="h-[1px] bg-slate-200 dark:bg-white/10 flex-grow"></div>
               <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">🎥 مقطع السنة</h3>
               <div className="h-[1px] bg-slate-200 dark:bg-white/10 flex-grow"></div>
             </div>
             <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.2)] border-8 border-white dark:border-slate-800 bg-black group">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-[3rem]"></div>
             </div>
          </div>
        )}

        {data.aboutGallery && data.aboutGallery.length > 0 && (
          <div className="space-y-12">
             <div className="flex items-center gap-6">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white whitespace-nowrap">🖼️ ألبوم صور العدد</h3>
               <div className="h-[1px] bg-slate-200 dark:bg-white/10 flex-grow"></div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.aboutGallery.filter(img => img).map((img, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl cursor-pointer transition-all hover:ring-4 hover:ring-emerald-500/30">
                    <MediaRenderer url={img} className="w-full h-full group-hover:scale-110 transition-transform duration-1000" alt={`Family Memory ${idx}`} />
                    <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors pointer-events-none"></div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
