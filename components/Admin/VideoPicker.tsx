
import React, { useRef, useState } from 'react';
import { MediaRenderer } from '../MediaRenderer';
import { dataService } from '../../services/dataService';

interface VideoPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const VideoPicker: React.FC<VideoPickerProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for videos
        alert("حجم الفيديو كبير جداً (الأقصى 50 ميجابايت).");
        return;
      }
      
      setIsUploading(true);
      try {
        const fileName = `videos/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const downloadUrl = await dataService.uploadFile(file, fileName);
        onChange(downloadUrl);
      } catch (error) {
        console.error("Video upload error:", error);
        alert("فشل رفع الفيديو.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isRemote = value && value.startsWith('http');

  return (
    <div className="space-y-2 text-right" dir="rtl">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mr-1">{label}</label>
      <div className="flex gap-2">
        <div className={`flex-grow bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 p-3 rounded-xl transition-all text-[10px] font-bold shadow-sm flex items-center min-h-[44px] overflow-hidden truncate ${isRemote ? 'text-emerald-600' : ''}`}>
          {isUploading ? '⏳ جاري الرفع...' : (isRemote ? '✅ فيديو سحابي' : (value ? 'رابط خارجي' : 'لا يوجد فيديو'))}
        </div>
        <button 
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {isUploading ? '...' : 'رفع'}
        </button>
        {value && (
          <button 
            type="button"
            onClick={() => onChange('')} 
            className="bg-red-50 text-red-500 px-3 py-2 rounded-xl text-[10px] font-black border border-red-100 hover:bg-red-100 transition-all"
          >
            ✕
          </button>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
      
      {value && (
        <div className="mt-2 flex items-center gap-3 animate-in fade-in">
          <div className="w-24 h-16 rounded-xl overflow-hidden border-2 border-emerald-500/20 bg-white shadow-md">
            <MediaRenderer url={value} className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">الحالة:</span>
            <span className="text-[10px] font-black text-emerald-600">
              {isRemote ? 'مخزن سحابياً' : 'رابط خارجي'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
