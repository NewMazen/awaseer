
import React, { useState } from 'react';
import { AppData, NavbarLinkSettings, CustomStat } from '../../types';
import { ImagePicker } from './ImagePicker';
import { dataService } from '../../services/dataService';

interface Props {
  formData: AppData;
  updateField: (field: keyof AppData, value: any) => void;
}

export const SettingsAsasi: React.FC<Props> = ({ formData, updateField }) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState({ current: 0, total: 0 });

  const handleNavbarChange = (key: keyof AppData['navbarSettings'], field: keyof NavbarLinkSettings, value: any) => {
    const currentNavbar = { ...formData.navbarSettings };
    currentNavbar[key] = { ...currentNavbar[key], [field]: value };
    updateField('navbarSettings', currentNavbar);
  };

  const handleAddStat = () => {
    const newStats = [...(formData.stats || [])];
    newStats.push({ id: Date.now().toString(), label: 'إحصائية جديدة', value: '0', color: 'emerald' });
    updateField('stats', newStats);
  };

  const handleUpdateStat = (id: string, updates: Partial<CustomStat>) => {
    const newStats = formData.stats.map(s => s.id === id ? { ...s, ...updates } : s);
    updateField('stats', newStats);
  };

  const handleRemoveStat = (id: string) => {
    const newStats = formData.stats.filter(s => s.id !== id);
    updateField('stats', newStats);
  };

  // أداة الهجرة: تحويل كل الـ Base64 إلى روابط Storage
  const runMigration = async () => {
    const base64Items: { path: string[], value: string }[] = [];
    
    // دالة للبحث عن Base64 بشكل متداخل
    const findBase64 = (obj: any, path: string[] = []) => {
      if (!obj) return;
      if (typeof obj === 'string' && obj.startsWith('data:')) {
        base64Items.push({ path, value: obj });
      } else if (Array.isArray(obj)) {
        obj.forEach((item, i) => findBase64(item, [...path, i.toString()]));
      } else if (typeof obj === 'object') {
        Object.entries(obj).forEach(([key, val]) => findBase64(val, [...path, key]));
      }
    };

    findBase64(formData);

    if (base64Items.length === 0) {
      alert("✅ لم يتم العثور على ملفات Base64. بياناتك نظيفة!");
      return;
    }

    if (!confirm(`تم العثور على ${base64Items.length} ملفات مخزنة داخل النصوص. هل تريد رفعها إلى التخزين السحابي (Storage) لتحسين الأداء؟`)) {
      return;
    }

    setIsMigrating(true);
    setMigrationProgress({ current: 0, total: base64Items.length });

    const newData = JSON.parse(JSON.stringify(formData));

    try {
      for (let i = 0; i < base64Items.length; i++) {
        const item = base64Items[i];
        setMigrationProgress({ current: i + 1, total: base64Items.length });
        
        const mime = item.value.split(';')[0].split(':')[1];
        const ext = mime.split('/')[1] || 'bin';
        const folder = mime.split('/')[0] || 'misc';
        const fileName = `migrated/${folder}/${Date.now()}-${i}.${ext}`;
        
        const url = await dataService.uploadFile(item.value, fileName);
        
        // تحديث القيمة في الكائن الجديد
        let current = newData;
        for (let j = 0; j < item.path.length - 1; j++) {
          current = current[item.path[j]];
        }
        current[item.path[item.path.length - 1]] = url;
      }

      updateField('magazineTitle', newData.magazineTitle); // تريجر لتحديث الحالة الكلية
      // ملاحظة: يفضل تحديث الكائن كاملاً إذا كان updateField يدعم ذلك
      Object.keys(newData).forEach(key => {
        updateField(key as keyof AppData, newData[key as keyof AppData]);
      });

      alert("🎉 تمت الهجرة بنجاح! جميع الملفات الآن في Storage.");
    } catch (error) {
      console.error("Migration error:", error);
      alert("حدث خطأ أثناء الهجرة.");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in" dir="rtl">
      {/* تنبيه حالة الربط */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">📡</div>
          <div>
            <h4 className="font-black text-emerald-700 dark:text-emerald-400">مشروعك مرتبط بـ Firebase</h4>
            <p className="text-xs font-bold text-emerald-600/70">يتم حفظ النصوص في Firestore والملفات في Storage تلقائياً.</p>
          </div>
        </div>
        <button 
          onClick={runMigration}
          disabled={isMigrating}
          className={`px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-md ${
            isMigrating ? 'bg-slate-200 text-slate-400' : 'bg-white dark:bg-slate-800 text-emerald-600 hover:scale-105 active:scale-95'
          }`}
        >
          {isMigrating ? `⏳ جاري النقل (${migrationProgress.current}/${migrationProgress.total})` : '🔍 فحص ونقل ملفات Base64'}
        </button>
      </div>

      {/* القسم الأول: هوية المجلة والإصدار */}
      <section className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner">
        <h3 className="text-xl font-black text-emerald-600 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-lg">🏷️</span>
          هوية المجلة والإصدار
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">اسم المجلة (العنوان العريض)</label>
              <input type="text" value={formData.magazineTitle} onChange={e => updateField('magazineTitle', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-black text-lg shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">مسمى العائلة الرئيسي</label>
              <input type="text" value={formData.familyLabel} onChange={e => updateField('familyLabel', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">الوصف الفرعي للهوية</label>
              <input type="text" value={formData.familySubLabel} onChange={e => updateField('familySubLabel', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold shadow-sm" />
            </div>
          </div>
          <div className="space-y-4">
            <ImagePicker label="صورة الغلاف (الجد المؤسس)" value={formData.founderImage} onChange={v => updateField('founderImage', v)} />
          </div>
        </div>
      </section>

      {/* القسم الجديد: إدارة إحصائيات الصفحة الرئيسية */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-blue-600 flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-lg">📊</span>
            إحصائيات الصفحة الرئيسية
          </h3>
          <button 
            onClick={handleAddStat}
            className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-emerald-500 transition-all"
          >
            + إضافة إحصائية
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.stats && formData.stats.map((stat) => (
            <div key={stat.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 relative group transition-colors">
              <button 
                onClick={() => handleRemoveStat(stat.id)}
                className="absolute top-4 left-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs"
              >✕ حذف</button>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">المسمى</label>
                  <input 
                    type="text" 
                    value={stat.label} 
                    onChange={e => handleUpdateStat(stat.id, { label: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded-xl text-xs font-black outline-none border border-slate-100 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">القيمة</label>
                  <input 
                    type="text" 
                    value={stat.value} 
                    onChange={e => handleUpdateStat(stat.id, { value: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded-xl text-xs font-black outline-none border border-slate-100 dark:border-slate-700 text-center"
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {(['emerald', 'amber', 'blue', 'rose'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => handleUpdateStat(stat.id, { color })}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      color === 'emerald' ? 'bg-emerald-500' : 
                      color === 'amber' ? 'bg-amber-500' : 
                      color === 'blue' ? 'bg-blue-500' : 'bg-rose-500'
                    } ${stat.color === color ? 'border-white ring-2 ring-emerald-500 shadow-lg' : 'border-transparent'}`}
                  ></button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* القسم الثاني: نصوص الترحيب الرئيسية */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-xl font-black text-amber-600 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-lg">👋</span>
          نصوص الترحيب والتقديم
        </h3>
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">كلمة الترحيب العلوية</label>
            <input type="text" value={formData.heroWelcome} onChange={e => updateField('heroWelcome', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all font-black text-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">مسمى المؤسس (اللقب)</label>
              <input type="text" value={formData.founderLabel} onChange={e => updateField('founderLabel', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">اسم المؤسس (العميد)</label>
              <input type="text" value={formData.founderName} onChange={e => updateField('founderName', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all font-bold" />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">رقم الإصدار</label>
            <input type="text" value={formData.magazineIssue} onChange={e => updateField('magazineIssue', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">تاريخ الإصدار</label>
            <input type="text" value={formData.magazineDate} onChange={e => updateField('magazineDate', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all font-bold" />
          </div>
        </div>
        <div className="space-y-2 mt-6">
          <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">النص التعريفي الرئيسي</label>
          <textarea rows={3} value={formData.heroIntro} onChange={e => updateField('heroIntro', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all font-medium leading-relaxed" />
        </div>
      </section>

      {/* القسم الثالث: إدارة شريط التنقل */}
      <section className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner transition-colors">
        <h3 className="text-xl font-black text-blue-600 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-lg">🧭</span>
          إدارة شريط التنقل (Navbar)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formData.navbarSettings || {}).map(([key, value]) => {
            const settings = value as NavbarLinkSettings;
            return (
              <div key={key} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group shadow-sm transition-colors">
                <div className="flex-grow space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">قسم {key}</label>
                  <input 
                    type="text" 
                    value={settings.label} 
                    onChange={e => handleNavbarChange(key as any, 'label', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2 rounded-xl text-xs font-black border-none outline-none focus:ring-1 ring-blue-500"
                  />
                </div>
                <button 
                  onClick={() => handleNavbarChange(key as any, 'visible', !settings.visible)}
                  className={`ml-4 p-3 rounded-xl transition-all shadow-sm ${settings.visible ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                >
                  {settings.visible ? '👁️' : '🕶️'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* القسم الرابع: إعدادات الفوتر */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-xl font-black text-rose-600 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center text-lg">🦶</span>
          إعدادات تذييل الموقع (Footer)
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">نص الحقوق المحفوظة</label>
            <input type="text" value={formData.footerRightsText} onChange={e => updateField('footerRightsText', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-rose-500 outline-none transition-all font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">نص الحكمة / الحديث</label>
            <textarea rows={2} value={formData.footerHadithText} onChange={e => updateField('footerHadithText', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-rose-500 outline-none transition-all font-medium italic leading-relaxed" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">وصف العائلة المختصر</label>
            <textarea rows={3} value={formData.footerDescriptionText} onChange={e => updateField('footerDescriptionText', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-rose-500 outline-none transition-all font-medium leading-relaxed" />
          </div>
        </div>
      </section>
    </div>
  );
};
