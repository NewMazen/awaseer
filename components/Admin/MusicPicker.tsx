
import React, { useRef } from 'react';

interface MusicPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const MusicPicker: React.FC<MusicPickerProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الملف كبير جداً (الأقصى 2 ميجابايت).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 text-right" dir="rtl">
      <label className="text-sm font-black text-emerald-700 dark:text-emerald-400 block">{label}</label>
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700 transition-colors">
        <div className="flex flex-wrap items-center gap-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg flex items-center gap-2"
          >
            <span>📁</span> رفع ملف
          </button>
          
          <input 
            type="text" 
            value={value && value.startsWith('data:') ? 'تم رفع ملف محلي' : value}
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
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/mp3,audio/wav,audio/mpeg" className="hidden" />
    </div>
  );
};
