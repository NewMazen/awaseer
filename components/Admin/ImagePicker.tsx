
import React, { useRef, useState } from 'react';
import { MediaRenderer } from '../MediaRenderer';
import { dataService } from '../../services/dataService';

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "رفع صورة مباشرة" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200; // زيادة الدقة قليلاً لأننا نرفع للاستورج الآن
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const rawBase64 = ev.target?.result as string;
          const compressedBase64 = await compressImage(rawBase64);
          
          const fileName = `images/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
          const downloadUrl = await dataService.uploadFile(compressedBase64, fileName);
          
          onChange(downloadUrl);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload error:", error);
        alert("فشل رفع الصورة، يرجى المحاولة مرة أخرى.");
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
          {isUploading ? '⏳ جاري الرفع...' : (isRemote ? '✅ مرفوعة على السحابة' : (value ? 'رابط خارجي' : 'لا توجد صورة'))}
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
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      {value && (
        <div className="mt-2 flex items-center gap-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500/20 bg-white shadow-md">
            <MediaRenderer url={value} className="w-full h-full" alt="Preview" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">الحالة:</span>
            <span className="text-[10px] font-black text-emerald-600">
              {isRemote ? 'مخزنة سحابياً' : 'رابط خارجي'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
