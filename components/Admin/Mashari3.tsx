
import React from 'react';
import { AppData } from '../../types';
import { ImagePicker } from './ImagePicker';

interface Props {
  formData: AppData;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
}

export const Mashari3: React.FC<Props> = ({ formData, handleAddItem, handleUpdateItem, removeItem }) => {
  return (
    <div className="space-y-10 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-100 dark:border-emerald-900/30 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-600 flex items-center gap-2">
            <span>💼</span> دليل مشاريع العائلة
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">ندعم ونوثق المشاريع التجارية والريادية لأفراد العائلة</p>
        </div>
        <button 
          onClick={() => handleAddItem('projects', { owner: '', name: '', description: '', link: '', logo: '' })} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 whitespace-nowrap"
        >
          + إضافة مشروع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {formData.projects.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:shadow-2xl transition-all">
            {/* زر الحذف */}
            <button 
              onClick={() => removeItem('projects', p.id)} 
              className="absolute top-6 left-6 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="حذف المشروع"
            >
              ✕
            </button>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* خانة اسم المشروع */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-700 block mr-1 uppercase tracking-wider">اسم المشروع / البراند</label>
                  <input 
                    type="text" 
                    value={p.name} 
                    onChange={e => handleUpdateItem('projects', p.id, { name: e.target.value })} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl font-black border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all" 
                    placeholder="مثال: متجر شغف للخزف"
                  />
                </div>

                {/* خانة صاحب المشروع */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block mr-1 uppercase tracking-wider">اسم المؤسس / المالك</label>
                  <input 
                    type="text" 
                    value={p.owner} 
                    onChange={e => handleUpdateItem('projects', p.id, { owner: e.target.value })} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all" 
                    placeholder="اسم صاحب المشروع..."
                  />
                </div>
              </div>

              {/* رابط المشروع */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-600 block mr-1 uppercase tracking-wider">رابط المتجر أو حساب الإنستقرام</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-mono">https://</span>
                  <input 
                    type="text" 
                    value={p.link} 
                    onChange={e => handleUpdateItem('projects', p.id, { link: e.target.value })} 
                    className="w-full bg-blue-50/30 dark:bg-blue-950/10 p-3.5 pl-16 rounded-2xl text-xs font-mono border-none outline-none ring-1 ring-blue-100 dark:ring-blue-900/30 text-left dir-ltr focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="www.instagram.com/yourproject"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* وصف المشروع */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 block mr-1 uppercase tracking-wider">نبذة تفصيلية عن المشروع</label>
                <textarea 
                  rows={4}
                  value={p.description} 
                  onChange={e => handleUpdateItem('projects', p.id, { description: e.target.value })} 
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-medium border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed" 
                  placeholder="اشرح طبيعة مشروعك وماذا يقدم للعملاء..."
                />
              </div>

              {/* شعار المشروع */}
              <div className="pt-2">
                <ImagePicker 
                  label="🖼️ شعار المشروع (Logo)" 
                  value={p.logo} 
                  onChange={v => handleUpdateItem('projects', p.id, { logo: v })} 
                />
              </div>
            </div>
          </div>
        ))}

        {formData.projects.length === 0 && (
          <div className="col-span-full py-24 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
             <div className="text-7xl mb-6 grayscale opacity-20">💼</div>
             <p className="text-slate-400 font-black text-lg">لم يتم إضافة أي مشاريع في الدليل حتى الآن.</p>
             <p className="text-slate-500 text-xs mt-2">ابدأ بإضافة أول مشروع ريادي للعائلة!</p>
          </div>
        )}
      </div>
    </div>
  );
};
