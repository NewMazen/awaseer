
import React, { useRef } from 'react';
import { AppData } from '../../types';
import { ImagePicker } from './ImagePicker';

interface Props {
  formData: AppData;
  updateField: (field: keyof AppData, value: any) => void;
}

export const QisaMaarad: React.FC<Props> = ({ formData, updateField }) => {
  const galleryFilesRef = useRef<HTMLInputElement>(null);

  const handleBatchGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const loaders = files.slice(0, 20).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loaders).then(results => {
      updateField('aboutGallery', results);
    });
  };

  const removeGalleryImage = (idx: number) => {
    const newGallery = (formData.aboutGallery || []).filter((_, i) => i !== idx);
    updateField('aboutGallery', newGallery);
  };

  return (
    <div className="space-y-8 animate-in fade-in" dir="rtl">
      <h2 className="text-2xl font-black text-amber-600 border-b pb-4">قصة العدد والمعرض</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-400 mr-2">عنوان القصة</label>
            <input 
              type="text" 
              value={formData.featuredStoryTitle} 
              onChange={e => updateField('featuredStoryTitle', e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:border-amber-500 transition-colors" 
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-400 mr-2">رابط فيديو السنة (YouTube)</label>
            <input 
              type="text" 
              value={formData.featuredYouTubeUrl} 
              onChange={e => updateField('featuredYouTubeUrl', e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:border-amber-500 transition-colors" 
            />
          </div>
        </div>
        <ImagePicker label="صورة القصة الرئيسية" value={formData.featuredStoryImage} onChange={v => updateField('featuredStoryImage', v)} />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-black text-slate-400 mr-2">نص القصة التفصيلي</label>
        <textarea 
          rows={6} 
          value={formData.featuredStoryText} 
          onChange={e => updateField('featuredStoryText', e.target.value)} 
          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-100 dark:border-slate-700 outline-none focus:border-amber-500 leading-loose transition-colors" 
          placeholder="نص القصة..." 
        />
      </div>
      
      <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black mb-1 flex items-center gap-2 dark:text-white">🖼️ معرض ألبوم العدد</h3>
            <p className="text-xs text-slate-500 font-bold">يمكنك رفع حتى 20 صورة</p>
          </div>
          <button 
            onClick={() => galleryFilesRef.current?.click()} 
            className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all"
          >
            رفع صور المعرض 📁
          </button>
          <input type="file" multiple accept="image/*" ref={galleryFilesRef} onChange={handleBatchGalleryUpload} className="hidden" />
        </div>

        {formData.aboutGallery && formData.aboutGallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formData.aboutGallery.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md group">
                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                <button onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black transition-opacity text-xs">حذف ✕</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-bold italic">لا توجد صور في المعرض.</div>
        )}
      </div>
    </div>
  );
};
