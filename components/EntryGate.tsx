import React, { useState } from 'react';

interface EntryGateProps {
  onUnlock: () => void;
  magazineTitle: string;
  familyLabel: string;
}

export const EntryGate: React.FC<EntryGateProps> = ({ onUnlock, magazineTitle, familyLabel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة تأخير بسيط لإعطاء طابع الفخامة والتحقق
    setTimeout(() => {
      // الرقم السري المعتمد: 20252026
      if (password === '20252026') {
        onUnlock();
      } else {
        setError(true);
        setIsLoading(false);
        // اهتزاز عند الخطأ
        setTimeout(() => setError(false), 500);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-slate-950 text-right font-sans px-4" dir="rtl">
      {/* خلفية جمالية متحرّكة */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-emerald-600 rounded-full blur-[50px] md:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[180px] md:w-[400px] h-[180px] md:h-[400px] bg-amber-600 rounded-full blur-[50px] md:blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className={`relative w-full max-w-[340px] md:max-w-md transition-all duration-500 ${error ? 'animate-shake' : ''}`}>
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
          
          <div className="mb-6 md:mb-8 space-y-3 md:space-y-5 relative z-10">
            {/* اللوجو المصغر */}
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl animate-bounce mx-auto relative group">
              <span className="text-white text-2xl md:text-5xl font-black select-none mb-1">أ</span>
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/10 opacity-20 transition-opacity"></div>
              <div className="absolute -inset-3 bg-emerald-500/20 blur-xl rounded-full opacity-50 -z-10"></div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                {magazineTitle}
              </h1>
              <p className="text-emerald-400 font-bold tracking-widest text-[9px] md:text-xs">
                بوابة {familyLabel} الخاصة
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7 relative z-10">
            <div className="space-y-2">
              <label className="text-white/50 text-[10px] md:text-xs font-bold leading-relaxed block">أدخل كلمة مرور العائلة للمتابعة</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••"
                className={`w-full bg-white/5 border-2 ${error ? 'border-red-500 bg-red-500/10' : 'border-white/10 focus:border-emerald-500'} p-3.5 md:p-5 rounded-xl md:rounded-2xl outline-none text-white text-center text-lg md:text-2xl tracking-[0.3em] transition-all placeholder:text-white/10 shadow-inner`}
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-[10px] font-bold animate-in fade-in slide-in-from-top-1">عذراً، الرقم السري غير صحيح</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                password 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  جاري التحقق...
                </>
              ) : (
                <>دخول البوابة 🔐</>
              )}
            </button>
          </form>

          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 relative z-10">
            <p className="text-white/40 text-[10px] md:text-[11px] font-bold leading-relaxed max-w-[200px] md:max-w-xs mx-auto">
              المجلة الرقمية للعائلة المليبارية<br/>
              ذرية علي أحمد مليباري
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};