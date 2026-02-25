
import React, { useState, useEffect } from 'react';
import Navbar, { ViewType } from './components/Navbar';
import Footer from './components/Footer';
import { FAMILY_NAME, FOUNDER_NAME, FOUNDER_BIO, MOCK_ACHIEVEMENTS, MOCK_INITIATIVES, MOCK_TALENTS, MOCK_PROJECTS, MOCK_NEWBORNS, MOCK_NEWLYWEDS, MOCK_TREE } from './constants';
import { AppData, GameScore, FamilyMember } from './types';
import { dataService } from './services/dataService';
import { saveGameScoreToFirebase } from "./services/scoresService";

import { LoginModal } from './components/Admin/LoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { LandingCover } from './components/Pages/LandingCover';
import { HallOfGloryPage } from './components/Pages/HallOfGloryPage';
import { AboutPage } from './components/Pages/AboutPage';
import { InitiativesPage } from './components/Pages/InitiativesPage';
import { TalentsPage } from './components/Pages/TalentsPage';
import { ProjectsPage } from './components/Pages/ProjectsPage';
import { OccasionsPage } from './components/Pages/OccasionsPage';
import { GamesPage } from './components/Pages/GamesPage';
import { FamilyTreePage } from './components/Pages/FamilyTreePage';
import { TeamPage } from './components/Pages/TeamPage';
import { EntryGate } from './components/EntryGate';

const INITIAL_DATA: AppData = {
  magazineTitle: 'أواصر',
  magazineIssue: 'الإصدار الماسي',
  magazineDate: 'شوال ١٤٤٥ هـ',
  heroWelcome: 'مرحباً بكم في بوابة',
  heroIntro: 'منصة عائلية تفاعلية تجمع شمل ذرية علي أحمد مليباري، صرحٌ يوثق تاريخنا ويحتفي بحاضرنا المشرق.',
  founderName: FOUNDER_NAME,
  founderLabel: 'العميد والمؤسس',
  familyLabel: 'آل مليباري',
  familySubLabel: 'المجلة الرقمية للعائلة المليبارية - ذرية علي أحمد مليباري',
  founderBio: FOUNDER_BIO,
  founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  gloryMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  featuredStoryTitle: 'مكة.. مهد الجذور والذكريات',
  featuredStoryText: 'في أزقة مكة العتيقة، وتحت ظلال مآذن الحرم، نبتت جذور عائلتنا. كان الجد محي الدين يحرص على الاجتماع الأسبوعي، حيث يغرس فينا قيم التكاتف والوفاء.',
  featuredStoryImage: 'https://images.unsplash.com/photo-1549111322-26210629ec23?auto=format&fit=crop&q=80&w=1200',
  featuredYouTubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  aboutGallery: [],
  achievements: MOCK_ACHIEVEMENTS,
  initiatives: MOCK_INITIATIVES,
  talents: MOCK_TALENTS,
  projects: MOCK_PROJECTS,
  newborns: MOCK_NEWBORNS,
  newlyweds: MOCK_NEWLYWEDS,
  healthUpdates: [],
  healthSectionTitle: '🌿 ركن العافية',
  quizQuestions: [
    { id: '1', question: 'من هو مؤسس العائلة؟', options: [FOUNDER_NAME, 'أحمد مليباري', 'خالد مليباري', 'سعيد مليباري'], correctAnswerIndex: 0 }
  ],
  gameScores: [],
  memoryGameImages: [],
  adventureDoors: [],
  familyTree: MOCK_TREE,
  teamData: {
    title: 'فريق العمل',
    subtitle: 'كوكبة من المبدعين سخروا جهودهم لخدمة العائلة وبناء هذا صرح الرقمي.',
    footerNote: 'كل الشكر والتقدير لكل من ساهم ولو بكلمة في نجاح هذا العمل.',
    leader1: { name: 'مازن مليباري', role: 'البرمجة والتنفيذ التقني', description: 'مهندس المنصة والمطور الرئيسي لنظام أواصر الرقمي.' },
    leader2: { name: 'سميرة مليباري', role: 'الإشراف والتنسيق العام', description: 'الإدارة العامة وتنسيق الجهود بين كافة فرق العمل العائلية.' },
    contentTeam: []
  },
  stats: [
    { id: '1', label: 'إنجاز عائلي', value: '50+', color: 'emerald' },
    { id: '2', label: 'مشروع ناشئ', value: '12+', color: 'amber' }
  ],
  footerRightsText: `جميع الحقوق محفوظة لمازن مليباري`,
  footerHadithText: `مَن أَحَبَّ أن يُبْسَطَ له في رزقِه ، وأن يُنْسَأَ له في أَثَرِهِ ، فَلْيَصِلْ رَحِمَه`,
  footerDescriptionText: `بوابة إلكترونية تجمع شمل ذرية علي أحمد مليباري، توثق الماضي، تحتفي بالحاضر، وتبني جسور التواصل للمستقبل.`,
  navbarSettings: {
    home: { label: 'الرئيسية', visible: true },
    about: { label: 'عن العائلة', visible: true },
    familyTree: { label: 'شجرة العائلة', visible: true },
    glory: { label: 'لوحة المجد', visible: true },
    occasions: { label: 'أخبار العائلة', visible: true },
    games: { label: 'ألعابنا', visible: true },
    initiatives: { label: 'المبادرات', visible: true },
    talents: { label: 'مواهبنا', visible: true },
    projects: { label: 'مشروعي الصغير', visible: true },
    team: { label: 'فريق العمل', visible: true }
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const remoteData = await dataService.fetchAppData(INITIAL_DATA);
        if (remoteData) setData(remoteData);
      } catch (error) {
        console.error("Data fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
      
      // إزالة التحقق من sessionStorage ليظهر الرقم السري في كل مرة يفتح فيها الموقع كما طلب المستخدم
      // const unlocked = sessionStorage.getItem('awaseer_unlocked');
      // if (unlocked === 'true') setIsUnlocked(true);
    };

    loadData();

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('awaseer_unlocked', 'true');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleSaveData = async (newData: AppData): Promise<boolean> => {
    const success = await dataService.saveAppData(newData);
    if (success) setData(newData);
    return success;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <EntryGate 
        onUnlock={handleUnlock} 
        magazineTitle={data.magazineTitle} 
        familyLabel={data.familyLabel} 
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return <LandingCover data={data} onEnter={setCurrentView} onAdminEnter={() => setIsLoginOpen(true)} />;
      case 'about': return <AboutPage data={data} />;
      case 'glory': return <HallOfGloryPage data={data} />;
      case 'initiatives': return <InitiativesPage data={data} />;
      case 'talents': return <TalentsPage data={data} />;
      case 'projects': return <ProjectsPage data={data} />;
      case 'occasions': return <OccasionsPage data={data} />;
      case 'games': return <GamesPage data={data} onSaveScore={saveGameScoreToFirebase} />;
      case 'familyTree': return <FamilyTreePage data={data} />;
      case 'team': return <TeamPage data={data} />;
      case 'admin': return <AdminDashboard data={data} onSave={handleSaveData} onExit={() => setCurrentView('home')} theme={theme} toggleTheme={toggleTheme} />;
      default: return <LandingCover data={data} onEnter={setCurrentView} onAdminEnter={() => setIsLoginOpen(true)} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar
        currentView={currentView as ViewType}
        setView={(v) => setCurrentView(v as any)}
        theme={theme}
        toggleTheme={toggleTheme}
        data={data}
      />
      <main className="min-h-screen">
        {renderView()}
      </main>
      {currentView !== 'admin' && (
        <Footer data={data} setView={(v) => setCurrentView(v as any)} onAdminClick={() => setIsLoginOpen(true)} />
      )}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {
          setIsLoginOpen(false);
          setCurrentView('admin');
        }}
      />
    </div>
  );
};

export default App;
