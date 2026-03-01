
import React, { useState, useEffect } from 'react';
import { AppData } from '../../types';
import { SettingsAsasi } from './SettingsAsasi';
import { QisaMaarad } from './QisaMaarad';
import { LawhatMajd } from './LawhatMajd';
import { IdaratAl3ab } from './IdaratAl3ab';
import { Mawahib } from './Mawahib';
import { Mashari3 } from './Mashari3';
import { Munasabat } from './Munasabat';
import { InitiativesAdmin } from './InitiativesAdmin';
import { FamilyTreeAdmin } from './FamilyTreeAdmin';
import { TeamAdmin } from './TeamAdmin';

interface AdminDashboardProps {
  data: AppData;
  onSave: (d: AppData) => Promise<boolean>;
  onExit: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onSave, onExit, theme, toggleTheme }) => {
  const [formData, setFormData] = useState<AppData>(data);
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  const handleFinalSave = async () => {
    setSaveStatus('saving');
    try {
      const success = await onSave(formData);
      if (success) {
        setSaveStatus('saved');
        setHasChanges(false);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error("Save Error:", error);
      setSaveStatus('error');
    }
  };

  const updateField = (field: keyof AppData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddItem = (field: keyof AppData, template: any) => {
    const list = (formData[field] as any[]) || [];
    setFormData(prev => ({ 
      ...prev, 
      [field]: [...list, { ...template, id: Date.now().toString() }] 
    }));
    setHasChanges(true);
  };

  const handleUpdateItem = (field: keyof AppData, id: string, updates: any) => {
    const list = formData[field] as any[];
    setFormData(prev => ({
      ...prev,
      [field]: list.map((item: any) => item.id === id ? { ...item, ...updates } : item)
    }));
    setHasChanges(true);
  };

  const removeItem = (field: keyof AppData, id: string) => {
    const list = formData[field] as any[];
    setFormData(prev => ({ 
      ...prev, 
      [field]: list.filter((item: any) => item.id !== id) 
    }));
    setHasChanges(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return <SettingsAsasi formData={formData} updateField={updateField} />;
      case 'story': return <QisaMaarad formData={formData} updateField={updateField} />;
      case 'tree': return <FamilyTreeAdmin formData={formData} updateField={updateField} />;
      case 'glory': return <LawhatMajd formData={formData} updateField={updateField} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} />;
      case 'initiatives': return <InitiativesAdmin formData={formData} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} />;
      case 'occasions': return <Munasabat formData={formData} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} updateField={updateField} />;
      case 'games': return <IdaratAl3ab formData={formData} updateField={updateField} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} />;
      case 'talents': return <Mawahib formData={formData} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} />;
      case 'projects': return <Mashari3 formData={formData} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} />;
      case 'teamAdmin': return <TeamAdmin formData={formData} updateField={updateField} handleAddItem={handleAddItem} handleUpdateItem={handleUpdateItem} removeItem={removeItem} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-right p-4 md:p-8 pt-20 font-sans transition-colors duration-500 overflow-x-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 bg-white/95 dark:bg-slate-900 p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 gap-4 sticky top-4 md:top-6 z-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0">أ</div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">لوحة التحكم</h1>
              <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${hasChanges ? 'text-blue-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
                <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${hasChanges ? 'bg-blue-600' : 'bg-emerald-600 dark:bg-emerald-400'}`}></span>
                {hasChanges ? 'تغييرات غير محفوظة' : 'كافة التغييرات محفوظة'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleTheme} className="p-2.5 md:p-3.5 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg hover:scale-110 transition-transform shadow-sm">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button 
              onClick={handleFinalSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl transition-all active:scale-95 ${
                saveStatus === 'saved' ? 'bg-emerald-500 text-white' : hasChanges ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
              }`}
            >
              {saveStatus === 'saving' ? 'حفظ...' : saveStatus === 'saved' ? 'تم ✓' : 'حفظ التغييرات'}
            </button>
            <button onClick={onExit} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm">خروج</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 md:gap-12">
          {/* شريط الأقسام المخصص للتابلت والكمبيوتر */}
          <div className="flex lg:flex-col gap-2 md:gap-3 overflow-x-auto pb-4 lg:pb-0 sticky lg:top-40 h-fit z-40 no-scrollbar">
            {[
              { id: 'general', label: 'الأساسية', icon: '⚙️' },
              { id: 'story', label: 'عن العائلة', icon: '📖' },
              { id: 'tree', label: 'إدارة الشجرة', icon: '🌳' },
              { id: 'occasions', label: 'الأخبار', icon: '💍' },
              { id: 'glory', label: 'لوحة المجد', icon: '🎓' },
              { id: 'initiatives', label: 'المبادرات', icon: '🤝' },
              { id: 'games', label: 'الألعاب', icon: '🎮' },
              { id: 'talents', label: 'المواهب', icon: '🎨' },
              { id: 'projects', label: 'المشاريع', icon: '💼' },
              { id: 'teamAdmin', label: 'فريق العمل', icon: '👥' },
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex-shrink-0 lg:w-full text-right px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all flex items-center gap-3 md:gap-4 border ${
                  activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-xl lg:translate-x-[-8px] border-emerald-500' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-lg md:text-xl">{tab.icon}</span> 
                <span className="text-xs md:text-sm whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative min-h-[500px] md:min-h-[600px] transition-colors overflow-hidden">
            <div className="h-full overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
