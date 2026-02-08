
import React from 'react';
import { AppData, AchievementType, Achievement } from '../../types';
import { ImagePicker } from './ImagePicker';
import { MusicPicker } from './MusicPicker';

interface Props {
  formData: AppData;
  updateField: (field: keyof AppData, value: any) => void;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
}

export const LawhatMajd: React.FC<Props> = ({ formData, updateField, handleAddItem, handleUpdateItem, removeItem }) => {
  
  const categories = [
    { type: AchievementType.PHD, label: '🎓 الدكاترة', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { type: AchievementType.MASTERS, label: '📜 الماجستير', color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-50 dark:bg-slate-800/30' },
    { type: AchievementType.BACHELORS, label: '🎖️ البكالوريوس', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { type: AchievementType.DIPLOMA, label: '🛠️ الدبلوم', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
    { type: AchievementType.HIGH_SCHOOL, label: '🌟 الثانوية', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    { type: AchievementType.RETIREE, label: '🏛️ المتقاعدون', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/10' },
    { type: AchievementType.INDIVIDUAL, label: '💎 إنجازات فردية', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/10' },
  ];

  const renderCategorySection = (cat: typeof categories[0]) => {
    const items = formData.achievements.filter(a => a.type === cat.type);
    
    return (
      <div key={cat.type} className={`p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 ${cat.bg} mb-10`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-black ${cat.color}`}>{cat.label}</h3>
          <button 
            onClick={() => handleAddItem('achievements', { 
              name: '', 
              type: cat.type, 
              description: '', 
              year: '1446', 
              image: '' 
            })} 
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-xl font-black text-xs shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
          >
            + إضافة جديد
          </button>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(ach => (
              <div key={ach.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative group transition-all">
                <button 
                  onClick={() => removeItem('achievements', ach.id)} 
                  className="absolute top-3 left-3 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">الاسم الكامل</label>
                    <input 
                      type="text" 
                      value={ach.name} 
                      onChange={e => handleUpdateItem('achievements', ach.id, { name: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2 rounded-xl text-sm font-bold border-none outline-none focus:ring-1 ring-emerald-500/20 shadow-inner" 
                      placeholder="اسم المبدع..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 block mr-1">التخصص / الشهادة</label>
                      <input 
                        type="text" 
                        value={ach.description} 
                        onChange={e => handleUpdateItem('achievements', ach.id, { description: e.target.value })} 
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2 rounded-xl text-xs font-bold border-none outline-none shadow-inner" 
                        placeholder="مثل: هندسة برمجيات"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 block mr-1">السنة</label>
                      <input 
                        type="text" 
                        value={ach.year} 
                        onChange={e => handleUpdateItem('achievements', ach.id, { year: e.target.value })} 
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2 rounded-xl text-xs font-bold border-none outline-none text-center shadow-inner" 
                        placeholder="1446"
                      />
                    </div>
                  </div>

                  <ImagePicker 
                    label="الصورة الشخصية" 
                    value={ach.image || ''} 
                    onChange={v => handleUpdateItem('achievements', ach.id, { image: v })} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic text-xs">لا يوجد مسجلين في هذه الفئة حالياً.</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-600">لوحة المجد</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">إدارة الخريجين والمبدعين مقسمين حسب الدرجة العلمية</p>
        </div>
      </div>

      <div className="p-1">
        <MusicPicker 
          label="🎵 موسيقى الخلفية للوحة المجد" 
          value={formData.gloryMusicUrl} 
          onChange={v => updateField('gloryMusicUrl', v)} 
        />
      </div>

      <div className="space-y-6">
        {categories.map(cat => renderCategorySection(cat))}
      </div>
    </div>
  );
};
