
import React, { useRef, useState } from 'react';
import { dataService } from '../../services/dataService';

interface MusicPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const MusicPicker: React.FC<MusicPickerProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // زيادة الحد لـ 10 ميجابايت لأننا نستخدم الاستورج
        alert("حجم الملف كبير جداً (الأقصى 10 ميجابايت).");
        return;
      }
      
      setIsUploading(true);
      try {
        const fileName = `audio/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const downloadUrl = await dataService.uploadFile(file, fileName);
        onChange(downloadUrl);
      } catch (error) {
        console.error("Audio upload error:", error);
        alert("فشل رفع الملف الصوتي.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isRemote = value && value.startsWith('http');

  return (
    <div className="space-y-3 text-right" dir="rtl">
      <label className="text-sm font-black text-emerald-700 dark:text-emerald-400 block">{label}</label>
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700 transition-colors">
        <div className="flex flex-wrap items-center gap-4">
          <button 
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isUploading ? '⏳' : '📁'}</span> {isUploading ? 'جاري الرفع...' : 'رفع ملف'}
          </button>
          
          <input 
            type="text" 
            value={isRemote ? '✅ ملف سحابي' : value}
            onChange={e => onChange(e.target.value)}
            placeholder="أو ضع رابط الموسيقى المباشر هنا..."
            className="flex-grow bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-xs outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />

          {value && (
            <button 
              type="button"
              onClick={() => onChange('')} 
              className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 rounded-xl text-xs font-black border border-red-100 dark:border-red-900/30"
            >
              حذف ✕
            </button>
          )}
        </div>

        {value && (
          <div className="space-y-2">
            <audio controls src={value} className="w-full h-10 rounded-lg" />
            <div className="text-[10px] text-slate-400 font-bold">
              {isRemote ? 'المصدر: Firebase Storage' : 'المصدر: رابط خارجي'}
            </div>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/mp3,audio/wav,audio/mpeg" className="hidden" />
    </div>
  );
};
