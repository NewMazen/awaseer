
import React, { useState } from 'react';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';
import { dataService } from '../../services/dataService';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', type: 'other', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    setStatus('sending');
    const success = await dataService.saveSubmission({
      senderName: formData.name,
      type: formData.type as any,
      content: formData.message,
      date: new Date().toLocaleDateString('ar-SA')
    });
    
    if (success) {
      setStatus('sent');
      setFormData({ name: '', type: 'other', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
    }
  };

  return (
    <PageTransition>
      <div className="pt-40 container mx-auto px-6 mb-40 text-right" dir="rtl">
        <SectionHeader 
          title="تواصل مع المشرفين" 
          subtitle="هل لديك خبر جديد؟ مولود؟ إنجاز؟ أو تود تحديث بياناتك في الشجرة؟ أرسل لنا وسنقوم بمراجعة طلبك." 
        />

        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-emerald-900/10">
          {status === 'sent' ? (
            <div className="text-center py-12 animate-in zoom-in">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-black text-emerald-600 mb-2">تم الإرسال بنجاح!</h3>
              <p className="text-slate-500 font-bold">شكراً لمشاركتك، سيقوم المشرفون بمراجعة طلبك قريباً.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-emerald-600 font-black underline">إرسال طلب آخر</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2">اسمك الكريم</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500/20 font-bold dark:text-white"
                  placeholder="محمد أحمد مليباري"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2">نوع الطلب</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white"
                >
                  <option value="achievement">توثيق إنجاز جديد</option>
                  <option value="newborn">إضافة مولود جديد</option>
                  <option value="newlywed">إضافة عرسان</option>
                  <option value="tree_update">تحديث في شجرة العائلة</option>
                  <option value="other">أخرى / رسالة عامة</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2">التفاصيل</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500/20 font-bold dark:text-white"
                  placeholder="اكتب تفاصيل طلبك أو الخبر هنا..."
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {status === 'sending' ? 'جاري الإرسال...' : 'إرسال للمراجعة 📤'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
