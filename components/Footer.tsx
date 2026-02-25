
import React from 'react';
import { FAMILY_NAME } from '../constants';
import { ViewType } from './Navbar';
import { AppData } from '../types';

interface FooterProps {
  data: AppData;
  setView: (view: ViewType) => void;
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ data, setView, onAdminClick }) => {
  return (
    <footer className="relative transition-colors duration-700 overflow-hidden">
      {/* فاصل تقليدي بسيط وراقي */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>

      {/* الفوتر الآن بخلفية داكنة دائماً ليعطي تبايناً فخماً في الوضع الفاتح */}
      <div className="bg-slate-950 text-slate-300 pt-24 pb-12 relative overflow-hidden">
        {/* هالات خلفية خافتة جداً */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            
            {/* العمود الأول: عن العائلة */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-emerald-600/20">أ</div>
                <span className="text-3xl font-black tracking-tighter text-white">{FAMILY_NAME}</span>
              </div>
              <p className="text-slate-400 text-sm leading-loose font-medium max-w-xs">
                {data.footerDescriptionText || 'بوابة إلكترونية تجمع شمل ذرية محي الدين مليباري، توثق الماضي، تحتفي بالحاضر، وتبني جسور التواصل للمستقبل.'}
              </p>
            </div>

            {/* العمود الثاني: روابط سريعة */}
            <div className="space-y-8">
              <h4 className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em]">خريطة الموقع</h4>
              <ul className="space-y-5">
                {[
                  { name: data.navbarSettings.about?.label || 'عن العائلة', view: 'about' },
                  { name: data.navbarSettings.familyTree?.label || 'شجرة العائلة', view: 'familyTree' },
                  { name: data.navbarSettings.glory?.label || 'لوحة المجد', view: 'glory' },
                  { name: data.navbarSettings.team?.label || 'فريق العمل', view: 'team' }
                ].map(link => (
                  <li key={link.view}>
                    <button onClick={() => { setView(link.view as ViewType); window.scrollTo(0,0); }} className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* العمود الثالث: خدمات التفاعلية */}
            <div className="space-y-8">
              <h4 className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em]">تفاعل معنا</h4>
              <ul className="space-y-5">
                <li>
                  <button onClick={() => { setView('games'); window.scrollTo(0,0); }} className="text-slate-300 hover:text-white transition-colors text-sm font-bold bg-white/5 px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/10 flex items-center gap-3 w-full group">
                    <span className="text-lg group-hover:scale-125 transition-transform">🎮</span> {data.navbarSettings.games?.label || 'ألعاب أواصر'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { setView('occasions'); window.scrollTo(0,0); }} className="text-slate-300 hover:text-white transition-colors text-sm font-bold bg-white/5 px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/10 flex items-center gap-3 w-full group">
                    <span className="text-lg group-hover:scale-125 transition-transform">💍</span> أخبار المجتمع
                  </button>
                </li>
              </ul>
            </div>

            {/* العمود الرابع: قول مأثور */}
            <div className="space-y-8">
              <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.2em]">صلة الرحم</h4>
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 italic text-sm text-slate-300 leading-loose shadow-inner">
                "{data.footerHadithText || 'مَن أَحَبَّ أن يُبْسَطَ له في رزقِه ، وأن يُنْسَأَ له في أَثَرِهِ ، فَلْيَصِلْ رَحِمَه'}"
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-slate-500 font-bold tracking-widest uppercase">
            <p>© {new Date().getFullYear()} {data.footerRightsText || 'جميع الحقوق محفوظة لمازن مليباري'}</p>
            <div className="flex gap-8">
              <button onClick={onAdminClick} className="hover:text-emerald-500 transition-colors">بوابة المشرفين</button>
              <span className="opacity-20 hidden md:inline">|</span>
              <p className="normal-case">صنع بكل حب للعائلة ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
