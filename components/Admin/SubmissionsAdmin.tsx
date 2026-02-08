
import React, { useState, useEffect } from 'react';
import { UpdateSubmission } from '../../types';
import { dataService } from '../../services/dataService';

export const SubmissionsAdmin: React.FC = () => {
  const [submissions, setSubmissions] = useState<UpdateSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    const data = await dataService.fetchSubmissions();
    setSubmissions(data.reverse()); // الأحدث أولاً
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      await dataService.deleteSubmission(id);
      loadSubmissions();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆 إنجاز جديد';
      case 'newborn': return '👶 مولود جديد';
      case 'newlywed': return '💍 عرسان';
      case 'tree_update': return '🌳 تحديث شجرة';
      default: return '📧 رسالة عامة';
    }
  };

  if (loading) {
    return <div className="py-20 text-center animate-pulse text-emerald-600 font-black">جاري تحميل الطلبات...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-emerald-600">طلبات التحديث والرسائل الواردة</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">هنا تظهر الرسائل التي يرسلها أفراد العائلة من صفحة التواصل</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800">
           <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">إجمالي الرسائل: {submissions.length}</span>
        </div>
      </div>

      {submissions.length > 0 ? (
        <div className="grid gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative group hover:shadow-md transition-all">
              <button 
                onClick={() => handleDelete(sub.id)}
                className="absolute top-6 left-6 text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                title="حذف الرسالة"
              >
                ✕
              </button>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">المرسل</span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">{sub.senderName}</h4>
                  <div className="mt-3 inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black">
                    {getTypeLabel(sub.type)}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-4">📅 {sub.date}</p>
                </div>
                
                <div className="md:w-3/4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">محتوى الرسالة</span>
                   <p className="text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-wrap font-medium">
                     {sub.content}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-6xl mb-4 opacity-20">📩</div>
          <p className="text-slate-400 font-black">صندوق الرسائل فارغ حالياً.</p>
          <p className="text-slate-500 text-xs mt-2 italic">عندما يرسل أحد أفراد العائلة خبراً، سيظهر هنا فوراً.</p>
        </div>
      )}
    </div>
  );
};
