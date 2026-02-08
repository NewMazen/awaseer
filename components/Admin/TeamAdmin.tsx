
import React from 'react';
import { AppData, TeamMember, TeamLeader } from '../../types';

interface Props {
  formData: AppData;
  updateField: (field: keyof AppData, value: any) => void;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
}

export const TeamAdmin: React.FC<Props> = ({ formData, updateField }) => {
  const teamData = formData.teamData || {
    title: 'فريق العمل',
    subtitle: '',
    footerNote: '',
    leader1: { name: '', role: '', description: '' },
    leader2: { name: '', role: '', description: '' },
    contentTeam: []
  };

  const updateTeamMeta = (field: 'title' | 'subtitle' | 'footerNote', value: string) => {
    updateField('teamData', { ...teamData, [field]: value });
  };

  const updateLeader = (leaderKey: 'leader1' | 'leader2', field: keyof TeamLeader, value: string) => {
    const newData = { ...teamData };
    newData[leaderKey] = { ...newData[leaderKey], [field]: value };
    updateField('teamData', newData);
  };

  const addContentMember = () => {
    const newData = { ...teamData };
    newData.contentTeam = [
      ...(newData.contentTeam || []),
      { id: Date.now().toString(), name: 'عضو جديد', role: 'مساهم مبدع', description: 'أوصف هنا ما قدمه للعائلة بالتفصيل...' }
    ];
    updateField('teamData', newData);
  };

  const updateContentMember = (id: string, field: keyof TeamMember, value: string) => {
    const newData = { ...teamData };
    newData.contentTeam = newData.contentTeam.map(m => m.id === id ? { ...m, [field]: value } : m);
    updateField('teamData', newData);
  };

  const removeContentMember = (id: string) => {
    const newData = { ...teamData };
    newData.contentTeam = newData.contentTeam.filter(m => m.id !== id);
    updateField('teamData', newData);
  };

  return (
    <div className="space-y-12 animate-in fade-in" dir="rtl">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-black text-emerald-600">إدارة فريق العمل</h2>
      </div>

      <section className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 space-y-8 transition-colors">
        <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-3">📝 النصوص الرئيسية</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mr-2">عنوان الصفحة</label>
            <input 
              type="text" 
              value={teamData.title} 
              onChange={e => updateTeamMeta('title', e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-black outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mr-2">النص الفرعي</label>
            <textarea 
              value={teamData.subtitle} 
              onChange={e => updateTeamMeta('subtitle', e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl text-sm font-medium outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 h-24 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-10 rounded-[3.5rem] border-2 border-emerald-100 dark:border-emerald-900/30 space-y-6">
            <h3 className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2"><span>💻</span> القيادة التقنية</h3>
            <div className="space-y-4">
               <input type="text" value={teamData.leader1.name} onChange={e => updateLeader('leader1', 'name', e.target.value)} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black outline-none border border-slate-100 dark:border-slate-800" placeholder="الاسم" />
               <input type="text" value={teamData.leader1.role} onChange={e => updateLeader('leader1', 'role', e.target.value)} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs outline-none border border-slate-100 dark:border-slate-800" placeholder="المسمى" />
               <textarea value={teamData.leader1.description} onChange={e => updateLeader('leader1', 'description', e.target.value)} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm h-24 outline-none border border-slate-100 dark:border-slate-800" placeholder="الوصف" />
            </div>
         </div>
         <div className="bg-amber-50/40 dark:bg-amber-950/20 p-10 rounded-[3.5rem] border-2 border-amber-100 dark:border-amber-900/30 space-y-6">
            <h3 className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-2"><span>📋</span> الإشراف العام</h3>
            <div className="space-y-4">
               <input type="text" value={teamData.leader2.name} onChange={e => updateLeader('leader2', 'name', e.target.value)} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black outline-none border border-slate-100 dark:border-slate-800" placeholder="الاسم" />
               <input type="text" value={teamData.leader2.role} onChange={e => updateLeader('leader2', 'role', e.target.value)} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs outline-none border border-slate-100 dark:border-slate-800" placeholder="المسمى" />
               <textarea value={teamData.leader2.description} onChange={e => updateLeader('leader2', 'description', e.target.value)} className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm h-24 outline-none border border-slate-100 dark:border-slate-800" placeholder="الوصف" />
            </div>
         </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10 transition-colors">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">نجوم فريق المحتوى</h3>
          <button onClick={addContentMember} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm">إضافة عضو</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamData.contentTeam && teamData.contentTeam.map((member) => (
            <div key={member.id} className="relative bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 group transition-colors">
              <button onClick={() => removeContentMember(member.id)} className="absolute top-6 left-6 text-red-400 opacity-0 group-hover:opacity-100">✕</button>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={member.name} onChange={e => updateContentMember(member.id, 'name', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-black text-base outline-none border border-slate-100 dark:border-slate-700 focus:border-emerald-500 transition-all" />
                  <input type="text" value={member.role} onChange={e => updateContentMember(member.id, 'role', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold text-sm outline-none border border-slate-100 dark:border-slate-700 focus:border-emerald-500 transition-all" />
                </div>
                <textarea value={member.description} onChange={e => updateContentMember(member.id, 'description', e.target.value)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl text-xs font-medium outline-none border border-slate-100 dark:border-slate-700 h-24 resize-none leading-relaxed transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
