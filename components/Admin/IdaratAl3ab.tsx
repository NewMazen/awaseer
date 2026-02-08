
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { AppData, GameScore, PlayerCategory } from '../../types';
import { listenToGameScores, clearAllScores } from'../../services/scoresService';
import { MusicPicker } from './MusicPicker';
import { ImagePicker } from './ImagePicker';

interface Props {
  formData: AppData;
  updateField: (field: keyof AppData, value: any) => void;
  handleAddItem: (field: keyof AppData, template: any) => void;
  handleUpdateItem: (field: keyof AppData, id: string, updates: any) => void;
  removeItem: (field: keyof AppData, id: string) => void;
}

const getRankStyles = (index: number) => {
  if (index === 0) return 'bg-amber-50/50 dark:bg-amber-900/5';
  if (index === 1) return 'bg-slate-50/50 dark:bg-slate-800/5';
  if (index === 2) return 'bg-orange-50/50 dark:bg-orange-900/5';
  return '';
};

const getRankIcon = (index: number) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return index + 1;
};

const getGameLabel = (type: string) => {
  switch (type) {
    case 'quiz': return '🧠 خبير العائلة';
    case 'memory': return '🧩 تحدي الوجوه';
    case 'riddleDoors': return '🔑 مرسال أواصر';
    default: return type;
  }
};

export const IdaratAl3ab: React.FC<Props> = ({ formData, updateField, handleAddItem, handleUpdateItem, removeItem }) => {
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'leaderboard'>('config');
  const [categoryFilter, setCategoryFilter] = useState<PlayerCategory | 'all'>('all');
  const [gameFilter, setGameFilter] = useState<'all' | 'quiz' | 'memory' | 'riddleDoors'>('all');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToGameScores((liveScores) => {
      setScores(liveScores);
    });
    return () => unsubscribe();
  }, []);

  const executeClearAll = async () => {
    setIsDeleting(true);
    try {
      await clearAllScores();
      setShowConfirmDelete(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const processedScores = useMemo(() => {
    return scores
      .filter(s => categoryFilter === 'all' || s.playerCategory === categoryFilter)
      .filter(s => gameFilter === 'all' || s.gameType === gameFilter)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeInSeconds - b.timeInSeconds;
      });
  }, [scores, categoryFilter, gameFilter]);

  const addMemoryImage = () => {
    const currentImages = formData.memoryGameImages || [];
    updateField('memoryGameImages', [...currentImages, '']);
  };

  const updateMemoryImage = (idx: number, val: string) => {
    const newImages = [...(formData.memoryGameImages || [])];
    newImages[idx] = val;
    updateField('memoryGameImages', newImages);
  };

  const removeMemoryImage = (idx: number) => {
    const newImages = (formData.memoryGameImages || []).filter((_, i) => i !== idx);
    updateField('memoryGameImages', newImages);
  };

  return (
    <div className="space-y-10 animate-in fade-in" dir="rtl">
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-black mb-4 dark:text-white text-slate-900">تأكيد مسح كافة النتائج</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">سيتم حذف سجلات الصدارة نهائياً لجميع اللاعبين.</p>
            <div className="flex flex-col gap-3">
              <button onClick={executeClearAll} disabled={isDeleting} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-red-500 transition-all">
                {isDeleting ? 'جاري المسح...' : 'نعم، امسح السجلات'}
              </button>
              <button onClick={() => setShowConfirmDelete(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-2xl font-black text-blue-600 mb-1">إدارة الألعاب والنتائج</h2>
          <p className="text-xs text-slate-400 font-bold">تحكم في المسابقات وراقب لوحة صدارة العائلة</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner">
          <button onClick={() => setActiveSubTab('config')} className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeSubTab === 'config' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>⚙️ الإعدادات</button>
          <button onClick={() => setActiveSubTab('leaderboard')} className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeSubTab === 'leaderboard' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>🏆 لوحة النتائج</button>
        </div>
      </div>
      
      {activeSubTab === 'config' ? (
        <div className="space-y-12">
          {/* صوت المقدمة */}
          <div className="p-6 md:p-8 bg-sky-50 dark:bg-sky-900/10 rounded-[2.5rem] md:rounded-[3rem] border-2 border-sky-100 dark:border-sky-800/30">
            <h3 className="text-xl font-black text-sky-600 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-sky-100 dark:bg-sky-900/40 rounded-xl flex items-center justify-center text-xl">🔊</span>
              صوت حكاية مرسال أواصر
            </h3>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800">
              <MusicPicker 
                label="رابط أو ملف صوت الحكاية (يظهر زر سماعه للطفل)" 
                value={formData.adventureIntroAudioUrl || ''} 
                onChange={v => updateField('adventureIntroAudioUrl', v)} 
              />
              <p className="mt-4 text-[10px] text-slate-400 font-bold italic">💡 ملاحظة: تأكد من الضغط على "حفظ التغييرات" في أعلى الصفحة بعد رفع الصوت.</p>
            </div>
          </div>

          {/* صور تحدي الوجوه */}
          <div className="p-6 md:p-8 bg-purple-50 dark:bg-purple-900/10 rounded-[2.5rem] md:rounded-[3rem] border-2 border-purple-100 dark:border-purple-800/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-purple-600 flex items-center gap-3">
                <span className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-xl">🖼️</span>
                صور تحدي الوجوه (Memory)
              </h3>
              <button onClick={addMemoryImage} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-black">+ إضافة صورة</button>
            </div>
            <p className="text-[10px] text-slate-500 mb-6 font-bold italic">💡 سيتم ضغط الصور تلقائياً لضمان حفظها بنجاح في قاعدة البيانات.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(formData.memoryGameImages || []).map((img, idx) => (
                <div key={idx} className="relative bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-purple-100 dark:border-slate-800 group">
                   <ImagePicker label={`عضو العائلة ${idx+1}`} value={img} onChange={(v) => updateMemoryImage(idx, v)} />
                   <button onClick={() => removeMemoryImage(idx)} className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* أبواب المغامرة */}
          <div className="p-6 md:p-8 bg-amber-50/40 dark:bg-amber-900/10 rounded-[2.5rem] md:rounded-[3rem] border-2 border-amber-100 dark:border-amber-800/30">
            <h3 className="text-xl font-black text-amber-600 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-xl">🔑</span>
              أبواب مرسال أواصر (للأشبال)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-amber-100 dark:border-slate-800 space-y-4 group hover:shadow-md transition-all">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest">الباب {i + 1}</label>
                    <select 
                      value={formData.adventureDoors?.[i]?.challengeType || 'choice'} 
                      onChange={e => { const newDoors = [...(formData.adventureDoors || [])]; newDoors[i] = { ...newDoors[i], challengeType: e.target.value as any }; updateField('adventureDoors', newDoors); }}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-black p-2 rounded-xl outline-none border border-slate-100 dark:border-slate-700"
                    >
                      <option value="choice">اختيارات متعددة</option>
                      <option value="code">رقم سري</option>
                    </select>
                  </div>
                  <input type="text" value={formData.adventureDoors?.[i]?.label || ''} onChange={e => { const newDoors = [...(formData.adventureDoors || [])]; newDoors[i] = { ...newDoors[i], label: e.target.value }; updateField('adventureDoors', newDoors); }} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-2xl font-black text-sm outline-none" placeholder="عنوان الباب..." />
                  <textarea rows={2} value={formData.adventureDoors?.[i]?.riddle || ''} onChange={e => { const newDoors = [...(formData.adventureDoors || [])]; newDoors[i] = { ...newDoors[i], riddle: e.target.value }; updateField('adventureDoors', newDoors); }} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-2xl text-xs font-bold outline-none" placeholder="اللغز أو السؤال..." />
                  <input type="text" value={formData.adventureDoors?.[i]?.answer || ''} onChange={e => { const newDoors = [...(formData.adventureDoors || [])]; newDoors[i] = { ...newDoors[i], answer: e.target.value }; updateField('adventureDoors', newDoors); }} className="w-full bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl text-xs font-black text-center outline-none" placeholder="الإجابة الصحيحة أو الكود السري" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in space-y-8">
           <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="space-y-3 flex-grow">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mr-2">تصفية حسب الفئة</label>
                    <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
                       {[
                         { id: 'all', label: 'الكل', icon: '🌍' },
                         { id: 'male', label: 'الرجال', icon: '👨' },
                         { id: 'female', label: 'النساء', icon: '👩' },
                         { id: 'child', label: 'الأشبال', icon: '👶' }
                       ].map(f => (
                         <button 
                           key={f.id} 
                           onClick={() => setCategoryFilter(f.id as any)}
                           className={`flex-grow py-2.5 px-4 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${categoryFilter === f.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                         >
                           <span>{f.icon}</span> {f.label}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3 flex-grow">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mr-2">تصفية حسب اللعبة</label>
                    <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
                       {[
                         { id: 'all', label: 'الكل', icon: '🎮' },
                         { id: 'quiz', label: 'خبير العائلة', icon: '🧠' },
                         { id: 'memory', label: 'تحدي الوجوه', icon: '🧩' },
                         { id: 'riddleDoors', label: 'مرسال أواصر', icon: '🔑' }
                       ].map(f => (
                         <button 
                           key={f.id} 
                           onClick={() => setGameFilter(f.id as any)}
                           className={`flex-grow py-2.5 px-4 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${gameFilter === f.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                         >
                           <span>{f.icon}</span> {f.label}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl transition-colors">
             <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-black dark:text-white">قائمة الأبطال</h3>
                <button onClick={() => setShowConfirmDelete(true)} className="text-xs font-black text-red-500 hover:underline px-4 py-2 bg-red-50 dark:bg-red-950/20 rounded-xl"> 🗑️ مسح كافة النتائج </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-right min-w-[600px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="p-6 w-20 text-center">المركز</th>
                      <th className="p-6">البطل</th>
                      <th className="p-6 text-center">الفئة</th>
                      <th className="p-6 text-center">اللعبة</th>
                      <th className="p-6 text-center">الدرجة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                     {processedScores.map((s, idx) => (
                       <tr key={s.id} className={`group transition-colors ${getRankStyles(idx)}`}>
                          <td className="p-6 text-center">
                             <div className="w-10 h-10 mx-auto rounded-full bg-white/40 dark:bg-slate-900/40 flex items-center justify-center font-black text-sm shadow-sm border border-current/10"> {getRankIcon(idx)} </div>
                          </td>
                          <td className="p-6">
                             <span className="font-black text-base">{s.playerName}</span>
                             <div className="text-[10px] opacity-60 font-bold">{s.date}</div>
                          </td>
                          <td className="p-6 text-center">
                             <span className="px-3 py-1 rounded-full bg-white/50 dark:bg-slate-900/30 text-[10px] font-black border border-current/5">
                                {s.playerCategory === 'male' ? '👨 الرجال' : s.playerCategory === 'female' ? '👩 النساء' : '👶 الأشبال'}
                             </span>
                          </td>
                          <td className="p-6 text-center font-bold text-xs"> {getGameLabel(s.gameType)} </td>
                          <td className="p-6 text-center font-black"> ✨ {s.score} </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
