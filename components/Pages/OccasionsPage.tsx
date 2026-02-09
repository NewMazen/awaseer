import React, { useState } from 'react';
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

export const OccasionsPage: React.FC<{ data: AppData }> = ({ data }) => {
  const newlyweds = data.newlyweds || [];
  const newborns = data.newborns || [];
  const healthUpdates = data.healthUpdates || [];
  const healthTitle = data.healthSectionTitle || 'ركن العافية';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="pt-40 container mx-auto px-6 mb-40 text-right" dir="rtl">
        <SectionHeader 
          title="أخبار العائلة" 
          subtitle="في الحـلوة والمـرة نشارككـــم أخبـــار العائلــة" 
        />
        
        {/* قسم السلامة - العنوان ديناميكي الآن */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-black text-rose-600 whitespace-nowrap">{healthTitle}</h2>
            <div className="h-[1px] bg-rose-200 dark:bg-rose-900/30 flex-grow"></div>
          </div>

          {healthUpdates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {healthUpdates.map((update) => (
                <div 
                  key={update.id} 
                  className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-lg border border-rose-100 dark:border-rose-950/30 hover:shadow-2xl transition-all relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-rose-500/5 rounded-full -translate-x-12 -translate-y-12"></div>
                  
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] overflow-hidden flex items-center justify-center text-2xl shadow-inner border-2 border-white dark:border-slate-800">
                        {update.image ? (
                          <img src={update.image} className="w-full h-full object-cover" alt={update.name} />
                        ) : (
                          "💐"
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-[10px] shadow-lg border-2 border-white dark:border-slate-900">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{update.name}</h3>
                      <p className="text-rose-600 dark:text-rose-400 text-xs font-bold mt-1">الحمد لله على السلامة</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">نوع العملية</span>
                      <span className="text-slate-900 dark:text-white font-black">{update.surgeryName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">التاريخ</span>
                      <span className="text-slate-500 font-bold">{update.date}</span>
                    </div>
                    {update.note && (
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed mt-3 italic border-t border-slate-200 dark:border-slate-700 pt-3">
                        "{update.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 italic">
              اللهم متّع الجميع بالصحة والعافية.
            </div>
          )}
        </section>

        {/* بقية الأقسام (عرسان، مواليد) */}
        <section className="mb-32">
          <div className="flex flex-col mb-12">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-amber-600 whitespace-nowrap">💍 عرسان السنة</h2>
              <div className="h-[1px] bg-amber-200 dark:bg-amber-900/30 flex-grow"></div>
            </div>
            <p className="text-amber-700 dark:text-amber-500 font-bold mt-3 text-lg">
              بارك الله لكما وبارك عليكما وجمع بينكما في خير
            </p>
          </div>

          {newlyweds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {newlyweds.map((couple) => (
                <div 
                  key={couple.id} 
                  className="group bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => couple.image && setSelectedImage(couple.image)}
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={couple.image || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8'} 
                      className="w-full h-full object-contain md:object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={couple.names} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 right-8">
                       <h3 className="text-2xl font-black text-white drop-shadow-lg">{couple.names}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <div className="flex flex-col mb-12">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">👶 مواليد السنة</h2>
              <div className="h-[1px] bg-emerald-200 dark:bg-emerald-900/30 flex-grow"></div>
            </div>
            <p className="text-emerald-700 dark:text-emerald-500 font-bold mt-3 text-lg">
              بارك الله لكم في الموهوب وشكرتم الواهب وبلغ أشده ورزقتم بره
            </p>
          </div>
          
          {newborns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {newborns.map((baby) => (
                <div 
                  key={baby.id} 
                  className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-md border border-slate-100 dark:border-slate-800 flex items-center gap-6 hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => baby.image && setSelectedImage(baby.image)}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[1.8rem] overflow-hidden flex-shrink-0 border-2 border-emerald-50 dark:border-emerald-900/30 bg-slate-50">
                    <img 
                      src={baby.image || 'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9'} 
                      className="w-full h-full object-contain md:object-cover group-hover:scale-110 transition-transform" 
                      alt={baby.name} 
                    />
                  </div>
                  <div className="text-right overflow-hidden">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{baby.name}</h3>
                    <p className="text-slate-500 text-xs font-bold mb-3 truncate">ابن/ابنة: {baby.parents}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {selectedImage && (
          <div 
            className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <img src={selectedImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" alt="Full Preview" />
          </div>
        )}
      </div>
    </PageTransition>
  );
};
