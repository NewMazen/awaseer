
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
          title="أخبار المجتمع" 
          subtitle="في الحلوة والمـرة نشارككم هنا أخبار العائلة" 
        />
        
        {/* قسم السلامة */}
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

        {/* قسم العرسان */}
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
            /* [تعديل هنا]: تم تغيير عدد الأعمدة من md:grid-cols-2 إلى sm:grid-cols-2 lg:grid-cols-3 لتصغير حجم البطاقات */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newlyweds.map((couple) => (
                <div 
                  key={couple.id} 
                  /* [تعديل هنا]: تم تقليل استدارة الحواف من [3rem] إلى [2rem] لتناسب الحجم المصغر الجديد */
                  className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => couple.image && setSelectedImage(couple.image)}
                >
                  {/* [تعديل هنا]: تم تغيير نسبة العرض من aspect-video إلى aspect-[4/3] لجعل الصورة ملمومة أكثر */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={couple.image || 'https://picsum.photos/seed/wedding/800/600'} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={couple.names} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70"></div>
                    <div className="absolute bottom-4 right-6 text-right">
                       <h3 className="text-xl font-black text-white drop-shadow-lg">{couple.names}</h3>
                       <p className="text-amber-400 font-bold text-[10px] mt-0.5 flex items-center gap-2 justify-end">
                         <span>📅</span>
                         <span>{couple.date}</span>
                       </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 italic">لم يتم تسجيل زيجات جديدة مؤخراً.</div>
          )}
        </section>

        {/* قسم المواليد */}
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
                      src={baby.image || 'https://picsum.photos/seed/baby/400/400'} 
                      className="w-full h-full object-contain md:object-cover group-hover:scale-110 transition-transform" 
                      alt={baby.name} 
                    />
                  </div>
                  <div className="text-right overflow-hidden flex-grow">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{baby.name}</h3>
                    <p className="text-slate-500 text-[10px] md:text-xs font-bold mb-1 truncate">ابن/ابنة: {baby.parents}</p>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                      <span>📅</span>
                      <span>{baby.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 italic">لم يتم تسجيل مواليد جدد مؤخراً.</div>
          )}
        </section>

        {selectedImage && (
          <div 
            className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {selectedImage && (
              <img src={selectedImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" alt="Full Preview" />
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
};
