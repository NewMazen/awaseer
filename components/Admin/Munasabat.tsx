
import React from 'react';
import { AppData } from '../../types';
import { ImagePicker } from './ImagePicker';

interface Props {
  formData: AppData;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
  updateField: (field: keyof AppData, value: any) => void;
}

export const Munasabat: React.FC<Props> = ({ formData, handleAddItem, handleUpdateItem, removeItem, updateField }) => {
  return (
    <div className="space-y-16 animate-in fade-in">
      {/* إدارة قسم السلامة */}
      <div>
        <div className="bg-rose-50/50 dark:bg-rose-950/20 p-8 rounded-[3rem] border border-rose-100 dark:border-rose-900/30 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 flex-grow w-full max-w-md">
              <label className="text-xs font-black text-rose-700 dark:text-rose-400 block mr-1 uppercase tracking-widest">مسمى قسم السلامة (مثلاً: ركن العافية)</label>
              <input 
                type="text" 
                value={formData.healthSectionTitle || 'ركن العافية'} 
                onChange={e => updateField('healthSectionTitle', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl text-lg font-black border-2 border-transparent focus:border-rose-500 outline-none transition-all shadow-sm"
                placeholder="اكتب المسمى المفضل للقسم هنا..."
              />
            </div>
            <button 
              onClick={() => handleAddItem('healthUpdates', { name: 'اسم الشخص', surgeryName: 'نوع العملية أو الوعكة', date: '١٤٤٦ هـ', note: 'الحمد لله على السلامة، طهور إن شاء الله.', image: '' })} 
              className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 whitespace-nowrap"
            >
              + إضافة سجل سلامة جديد
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(formData.healthUpdates || []).map(h => (
            <div key={h.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group transition-all hover:shadow-xl">
              <button 
                onClick={() => removeItem('healthUpdates', h.id)} 
                className="absolute top-4 left-4 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">اسم الشخص</label>
                    <input 
                      type="text" 
                      value={h.name} 
                      onChange={e => handleUpdateItem('healthUpdates', h.id, { name: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm font-black border-none outline-none focus:ring-1 ring-rose-500/30" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">التاريخ</label>
                    <input 
                      type="text" 
                      value={h.date} 
                      onChange={e => handleUpdateItem('healthUpdates', h.id, { date: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border-none outline-none text-center" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1">العملية أو المناسبة الصحية</label>
                  <input 
                    type="text" 
                    value={h.surgeryName} 
                    onChange={e => handleUpdateItem('healthUpdates', h.id, { surgeryName: e.target.value })} 
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm font-bold border-none outline-none" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1">رسالة تمني بالشفاء</label>
                  <textarea 
                    rows={2}
                    value={h.note} 
                    onChange={e => handleUpdateItem('healthUpdates', h.id, { note: e.target.value })} 
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-medium border-none outline-none" 
                  />
                </div>

                <ImagePicker 
                  label="صورة الشخص (اختياري)" 
                  value={h.image || ''} 
                  onChange={v => handleUpdateItem('healthUpdates', h.id, { image: v })} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أقسام المواليد والعرسان */}
      <div>
        <div className="flex justify-between items-center border-b border-amber-100 dark:border-amber-900/30 pb-4 mb-8">
          <h2 className="text-2xl font-black text-amber-600">💍 سجل العرسان</h2>
          <button 
            onClick={() => handleAddItem('newlyweds', { names: 'الزوج & الزوجة', date: '١٤٤٦ هـ', image: '' })} 
            className="bg-amber-500 hover:bg-amber-400 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg transition-all"
          >
            + إضافة عروسين
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.newlyweds.map(c => (
            <div key={c.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group transition-all hover:shadow-lg">
              <button onClick={() => removeItem('newlyweds', c.id)} className="absolute top-4 left-4 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              <div className="space-y-4">
                <input type="text" value={c.names} onChange={e => handleUpdateItem('newlyweds', c.id, { names: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm font-bold border-none outline-none focus:ring-1 ring-amber-500/30" placeholder="أسماء العرسان..." />
                <input type="text" value={c.date} onChange={e => handleUpdateItem('newlyweds', c.id, { date: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border-none outline-none" placeholder="التاريخ..." />
                <ImagePicker label="صورة تذكارية" value={c.image || ''} onChange={v => handleUpdateItem('newlyweds', c.id, { image: v })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center border-b border-blue-100 dark:border-blue-900/30 pb-4 mb-8">
          <h2 className="text-2xl font-black text-blue-600">👶 سجل المواليد</h2>
          <button 
            onClick={() => handleAddItem('newborns', { name: 'اسم المولود', parents: 'الأب & الأم', date: '١٤٤٦ هـ', image: '' })} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg transition-all"
          >
            + إضافة مولود
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.newborns.map(b => (
            <div key={b.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group transition-all hover:shadow-lg">
              <button onClick={() => removeItem('newborns', b.id)} className="absolute top-4 left-4 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              <div className="space-y-4">
                <input type="text" value={b.name} onChange={e => handleUpdateItem('newborns', b.id, { name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm font-black border-none outline-none text-center focus:ring-1 ring-blue-500/30" placeholder="اسم المولود" />
                <input type="text" value={b.parents} onChange={e => handleUpdateItem('newborns', b.id, { parents: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border-none outline-none text-center" placeholder="الأب والأم" />
                <input type="text" value={b.date} onChange={e => handleUpdateItem('newborns', b.id, { date: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-[10px] font-bold border-none outline-none text-center" placeholder="تاريخ الميلاد" />
                <ImagePicker label="الصورة" value={b.image || ''} onChange={v => handleUpdateItem('newborns', b.id, { image: v })} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
