
import React from 'react';
import { AppData, Talent } from '../../types';
import { ImagePicker } from './ImagePicker';

interface Props {
  formData: AppData;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
}

export const Mawahib: React.FC<Props> = ({ formData, handleAddItem, handleUpdateItem, removeItem }) => {
  const talentTypes = [
    { value: 'رسم', label: '🎨 رسم وفنون', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { value: 'كتابة', label: '✍️ كتابة ومقالات', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { value: 'شعر', label: '📜 شعر وأدب', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { value: 'خطابة', label: '🎤 خطابة وإلقاء', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { value: 'أخرى', label: '🏆 إنجازات وجوائز', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-purple-600">إدارة المواهب الإبداعية</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">عرض وتوثيق إبداعات أبناء وبنات العائلة</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleAddItem('talents', { owner: '', talentType: 'رسم', title: '', content: '', description: '', date: '١٤٤٦ هـ' })} 
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg transition-all active:scale-95"
          >
            + إضافة عمل جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.talents.map(t => {
          const typeConfig = talentTypes.find(type => type.value === t.talentType) || talentTypes[0];
          
          return (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:shadow-xl transition-all">
              <button 
                onClick={() => removeItem('talents', t.id)} 
                className="absolute top-4 left-4 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              
              <div className="space-y-4">
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
                  {talentTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleUpdateItem('talents', t.id, { talentType: type.value })}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black whitespace-nowrap border transition-all ${
                        t.talentType === type.value 
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">الموهوب/ة</label>
                    <input 
                      type="text" 
                      value={t.owner} 
                      onChange={e => handleUpdateItem('talents', t.id, { owner: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm font-black border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-purple-500" 
                      placeholder="اسم المبدع..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">تاريخ العمل</label>
                    <input 
                      type="text" 
                      value={t.date} 
                      onChange={e => handleUpdateItem('talents', t.id, { date: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm font-black border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700" 
                      placeholder="١٤٤٦ هـ"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1">عنوان الموهبة / الإنجاز</label>
                  <input 
                    type="text" 
                    value={t.title} 
                    onChange={e => handleUpdateItem('talents', t.id, { title: e.target.value })} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700" 
                    placeholder="مثل: لوحة فجر مكة، أو الفوز بالمركز الأول..."
                  />
                </div>

                {(t.talentType === 'شعر' || t.talentType === 'كتابة' || t.talentType === 'خطابة') ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">النص / المحتوى الأدبي</label>
                    <textarea 
                      rows={5}
                      value={t.content} 
                      onChange={e => handleUpdateItem('talents', t.id, { content: e.target.value })} 
                      className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl text-xs font-medium border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-purple-500 leading-relaxed" 
                      placeholder="اكتب القصيدة أو النص هنا..."
                    />
                  </div>
                ) : (
                  <ImagePicker 
                    label="صورة العمل أو الجائزة" 
                    value={t.content} 
                    onChange={v => handleUpdateItem('talents', t.id, { content: v })} 
                  />
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1">وصف إضافي (اختياري)</label>
                  <input 
                    type="text" 
                    value={t.description} 
                    onChange={e => handleUpdateItem('talents', t.id, { description: e.target.value })} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold border-none outline-none" 
                    placeholder="نبذة بسيطة عن العمل..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
