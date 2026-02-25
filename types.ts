
export enum AchievementType {
  PHD = 'دكتوراه',
  MASTERS = 'ماجستير',
  BACHELORS = 'بكالوريوس',
  DIPLOMA = 'دبلوم',
  HIGH_SCHOOL = 'ثانوي',
  RETIREE = 'متقاعد',
  INDIVIDUAL = 'إنجاز فردي'
}

export type PlayerCategory = 'male' | 'female' | 'child';

export interface FamilyMember {
  id: string;
  name: string;
  title?: string;
  isDeceased?: boolean;
  children?: FamilyMember[];
  spouse?: string;
  bio?: string;
  gender?: 'male' | 'female';
}

export interface GameScore {
  id: string;
  playerName: string;
  playerCategory: PlayerCategory;
  gameType: 'quiz' | 'memory' | 'riddleDoors';
  score: number;
  timeInSeconds: number;
  date: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface AdventureDoor {
  label: string;
  riddle: string;
  answer: string;
  options?: string[]; 
  isSocialTask?: boolean; 
  challengeType: 'choice' | 'code'; 
}

export interface Achievement {
  id: string;
  name: string;
  type: AchievementType;
  description: string;
  year: string;
  image?: string;
}

export interface SocialInitiative {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface Talent {
  id: string;
  owner: string;
  talentType: 'رسم' | 'كتابة' | 'تصميم' | 'أخرى' | 'شعر' | 'خطابة';
  title: string;
  content: string; 
  description?: string;
  date?: string;
}

export interface Project {
  id: string;
  owner: string;
  name: string;
  description: string;
  link: string;
  logo: string;
}

export interface Newborn {
  id: string;
  name: string;
  parents: string;
  date: string;
  image?: string;
}

export interface Newlywed {
  id: string;
  names: string;
  date: string;
  image?: string;
}

export interface HealthUpdate {
  id: string;
  name: string;
  surgeryName: string;
  date: string;
  note?: string;
  image?: string;
}

export interface UpdateSubmission {
  id: string;
  senderName: string;
  type: 'achievement' | 'newborn' | 'newlywed' | 'tree_update' | 'other';
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NavbarLinkSettings {
  label: string;
  visible: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface TeamLeader {
  name: string;
  role: string;
  description: string;
}

export interface TeamData {
  title: string;
  subtitle: string;
  footerNote: string;
  leader1: TeamLeader; 
  leader2: TeamLeader; 
  contentTeam: TeamMember[];
}

export interface CustomStat {
  id: string;
  label: string;
  value: string;
  color: 'emerald' | 'amber' | 'blue' | 'rose';
}

export interface AppData {
  magazineTitle: string;
  magazineIssue: string;
  magazineDate: string;
  heroWelcome: string;
  heroIntro: string;
  founderName: string;
  founderLabel: string;
  familyLabel: string;
  familySubLabel: string;
  founderBio: string;
  founderImage: string;
  gloryMusicUrl: string;
  featuredStoryTitle: string;
  featuredStoryText: string;
  featuredStoryImage: string;
  featuredYouTubeUrl?: string;
  aboutGallery?: string[];
  achievements: Achievement[];
  initiatives: SocialInitiative[];
  talents: Talent[];
  projects: Project[];
  newborns: Newborn[];
  newlyweds: Newlywed[];
  healthUpdates: HealthUpdate[];
  healthSectionTitle: string;
  quizQuestions: QuizQuestion[];
  gameScores: GameScore[];
  memoryGameImages: string[];
  adventureIntroAudioUrl?: string;
  adventureDoors: AdventureDoor[];
  familyTree?: FamilyMember;
  teamData: TeamData;
  footerRightsText: string;
  footerHadithText: string;
  footerDescriptionText: string;
  stats: CustomStat[];
  navbarSettings: {
    home: NavbarLinkSettings;
    about: NavbarLinkSettings;
    familyTree: NavbarLinkSettings;
    glory: NavbarLinkSettings;
    occasions: NavbarLinkSettings;
    games: NavbarLinkSettings;
    initiatives: NavbarLinkSettings;
    talents: NavbarLinkSettings;
    projects: NavbarLinkSettings;
    team: NavbarLinkSettings;
  };
}
