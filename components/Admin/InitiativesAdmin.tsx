
import React from 'react';
import { AppData } from '../../types';
import { ImagePicker } from './ImagePicker';

interface Props {
  formData: AppData;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
}

export const InitiativesAdmin: React.FC<Props> = ({ formData, handleAddItem, handleUpdateItem, removeItem }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-600">المشاركات والمبادرات المجتمعية</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">توثيق حضور العائلة في بناء المجتمع والفعاليات العامة</p>
        </div>
        <button 
          onClick={() => handleAddItem('initiatives', { title: '', description: '', date: '١٤٤٦ هـ', image: '' })} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95"
        >
          + إضافة مشاركة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {formData.initiatives.map(init => (
          <div key={init.id} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-700 relative group hover:shadow-2xl transition-all">
            <button 
              onClick={() => removeItem('initiatives', init.id)} 
              className="absolute top-6 left-6 text-red-500 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 block mr-1">عنوان المشاركة / الحملة</label>
                <input 
                  type="text" 
                  value={init.title} 
                  onChange={e => handleUpdateItem('initiatives', init.id, { title: e.target.value })} 
                  className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl font-black border-none outline-none ring-1 ring-emerald-100 dark:ring-emerald-900 focus:ring-2 focus:ring-emerald-500" 
                  placeholder="مثلاً: المشاركة في بناء معرض مكة التاريخي..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1">التاريخ</label>
                  <input 
                    type="text" 
                    value={init.date} 
                    onChange={e => handleUpdateItem('initiatives', init.id, { date: e.target.value })} 
                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl text-xs font-bold border-none outline-none" 
                    placeholder="رمضان ١٤٤٦ هـ"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1">تفاصيل المشاركة</label>
                  <textarea 
                    rows={4}
                    value={init.description} 
                    onChange={e => handleUpdateItem('initiatives', init.id, { description: e.target.value })} 
                    className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl text-sm font-medium border-none outline-none leading-relaxed" 
                    placeholder="اكتب وصفاً للمشاركة وأثرها..."
                  />
                </div>
              </div>

              <ImagePicker 
                label="صورة من الفعالية / المشاركة" 
                value={init.image} 
                onChange={v => handleUpdateItem('initiatives', init.id, { image: v })} 
              />
            </div>
          </div>
        ))}

        {formData.initiatives.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-4">🤝</div>
            <p className="text-slate-400 font-bold">لا توجد مشاركات مسجلة حالياً. ابدأ بتوثيق بصمة العائلة!</p>
          </div>
        )}
      </div>
    </div>
  );
};
