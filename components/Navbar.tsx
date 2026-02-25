
import React, { useState, useEffect } from 'react';
import { FAMILY_NAME } from '../constants';
import { AppData } from '../types';

export type ViewType = 'home' | 'about' | 'glory' | 'initiatives' | 'talents' | 'projects' | 'occasions' | 'games' | 'familyTree' | 'admin' | 'team';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isAdminMode?: boolean;
  onAdminClick?: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  data: AppData;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isAdminMode, onAdminClick, theme, toggleTheme, data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarSettings = data.navbarSettings || ({} as AppData['navbarSettings']);

  const navLinks: { name: string; view: ViewType; highlight?: boolean; visible: boolean; icon?: string }[] = [
    { name: navbarSettings.home?.label || 'الرئيسية', view: 'home', visible: navbarSettings.home?.visible ?? true },
    { name: navbarSettings.about?.label || 'عن العائلة', view: 'about', visible: navbarSettings.about?.visible ?? true },
    { name: navbarSettings.familyTree?.label || 'شجرة العائلة', view: 'familyTree', highlight: true, visible: navbarSettings.familyTree?.visible ?? true },
    { name: navbarSettings.glory?.label || 'لوحة المجد', view: 'glory', visible: navbarSettings.glory?.visible ?? true },
    { name: navbarSettings.occasions?.label || 'أخبار العائلة', view: 'occasions', visible: navbarSettings.occasions?.visible ?? true },
    { name: navbarSettings.games?.label || 'ألعابنا', view: 'games', visible: navbarSettings.games?.visible ?? true },
    { name: navbarSettings.initiatives?.label || 'المبادرات', view: 'initiatives', visible: navbarSettings.initiatives?.visible ?? true },
    { name: navbarSettings.talents?.label || 'مواهبنا', view: 'talents', visible: navbarSettings.talents?.visible ?? true },
    { name: navbarSettings.projects?.label || 'مشروعي الصغير', view: 'projects', visible: navbarSettings.projects?.visible ?? true },
    { name: navbarSettings.team?.label || 'فريق العمل', view: 'team', visible: navbarSettings.team?.visible ?? true },
  ];

  const visibleLinks = navLinks.filter(link => link.visible);

  const LogoIcon = () => (
    <div className="relative w-7 h-7 md:w-9 md:h-9 flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg shadow-lg transform group-hover:rotate-12 transition-all duration-500 overflow-hidden">
      <span className="text-white font-black text-lg md:text-xl select-none mb-0.5">أ</span>
    </div>
  );

  if (currentView === 'admin') return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled || currentView !== 'home' ? 'py-0.5 md:py-1' : 'py-1 md:py-2'
      }`}>
        <div className={`container mx-auto px-3 md:px-6 transition-all duration-500 ${
           isScrolled || currentView !== 'home' ? 'max-w-6xl' : 'max-w-full'
        }`}>
          <div className={`flex justify-between items-center p-1.5 md:p-2 rounded-[1rem] md:rounded-[1.5rem] transition-all duration-500 ${
            isScrolled || currentView !== 'home'
            ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl shadow-xl border border-white/20'
            : 'bg-transparent'
          }`}>
            
            <button 
              onClick={() => { setView('home'); window.scrollTo(0, 0); }} 
              className="flex items-center gap-1.5 md:gap-2.5 group focus:outline-none min-w-0"
            >
              <LogoIcon />
              <div className="flex flex-col items-start leading-none">
                <span className={`text-base md:text-lg font-black transition-colors ${
                  isScrolled || currentView !== 'home' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {FAMILY_NAME}
                </span>
              </div>
            </button>
            
            <div className="hidden lg:flex items-center gap-1">
              {visibleLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => { setView(link.view); window.scrollTo(0, 0); }}
                  className={`px-3 py-2 rounded-xl text-[12px] font-black transition-all flex items-center gap-1.5 ${
                    currentView === link.view 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : `hover:bg-emerald-50 dark:hover:bg-emerald-900/30 ${isScrolled || currentView !== 'home' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`
                  }`}
                >
                  {link.icon || (link.highlight ? '🌳' : '')}
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all ${
                  isScrolled || currentView !== 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-600'
                  : 'bg-white/10 border-white/20 text-white backdrop-blur-md'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-emerald-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-16 6h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[150] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute left-0 top-0 bottom-0 w-[70%] bg-white dark:bg-slate-900 transition-transform duration-500 overflow-y-auto overscroll-behavior-contain touch-pan-y ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <LogoIcon />
                <span className="text-lg font-black text-emerald-700">{FAMILY_NAME}</span>
              </div>
           </div>
           <div className="p-3 flex flex-col gap-1">
             {visibleLinks.map((link) => (
               <button
                 key={link.view}
                 onClick={() => { setView(link.view); setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}
                 className={`text-right p-2.5 rounded-lg text-sm font-black transition-all ${
                   currentView === link.view ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300'
                 }`}
               >
                 {link.icon || ''} {link.name}
               </button>
             ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
