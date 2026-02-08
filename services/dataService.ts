
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { AppData, UpdateSubmission, TeamData } from '../types';

const DATA_COLLECTION = 'app_data';
const TEAM_COLLECTION = 'team_config';
const SUBMISSIONS_COLLECTION = 'submissions';

const DOCS = {
  UI: 'ui_settings',
  CONTENT: 'dynamic_content',
  TREE: 'family_tree',
  TEAM: 'team_main_data'
};

const sanitizeForFirebase = (data: any): any => {
  if (data === undefined || data === null) return "";
  if (Array.isArray(data)) return data.map(item => sanitizeForFirebase(item));
  if (typeof data === 'object' && data !== null) {
    const newObj: any = {};
    for (const key in data) {
      newObj[key] = sanitizeForFirebase(data[key]);
    }
    return newObj;
  }
  return data;
};

export const dataService = {
  async fetchAppData(initialData: AppData): Promise<AppData> {
    try {
      const [uiSnap, contentSnap, treeSnap, teamSnap] = await Promise.all([
        getDoc(doc(db, DATA_COLLECTION, DOCS.UI)),
        getDoc(doc(db, DATA_COLLECTION, DOCS.CONTENT)),
        getDoc(doc(db, DATA_COLLECTION, DOCS.TREE)),
        getDoc(doc(db, TEAM_COLLECTION, DOCS.TEAM))
      ]);

      let mergedData = { ...initialData };
      if (uiSnap.exists()) mergedData = { ...mergedData, ...uiSnap.data() };
      if (contentSnap.exists()) mergedData = { ...mergedData, ...contentSnap.data() };
      if (treeSnap.exists()) mergedData.familyTree = treeSnap.data().familyTree;
      if (teamSnap.exists()) mergedData.teamData = teamSnap.data() as TeamData;

      return mergedData;
    } catch (e) {
      console.error("❌ Fetch Error:", e);
      return initialData;
    }
  },

  async saveAppData(data: AppData): Promise<boolean> {
    try {
      const clean = sanitizeForFirebase(data);

      // حفظ البيانات بشكل متسلسل لضمان عدم تجاوز سعة الذاكرة في المتصفح (منع أخطاء postMessage)
      await setDoc(doc(db, DATA_COLLECTION, DOCS.UI), {
        magazineTitle: clean.magazineTitle,
        magazineIssue: clean.magazineIssue,
        magazineDate: clean.magazineDate,
        heroWelcome: clean.heroWelcome,
        heroIntro: clean.heroIntro,
        founderName: clean.founderName,
        founderLabel: clean.founderLabel,
        familyLabel: clean.familyLabel,
        familySubLabel: clean.familySubLabel,
        founderBio: clean.founderBio,
        founderImage: clean.founderImage,
        gloryMusicUrl: clean.gloryMusicUrl,
        adventureIntroAudioUrl: clean.adventureIntroAudioUrl,
        footerRightsText: clean.footerRightsText,
        footerHadithText: clean.footerHadithText,
        footerDescriptionText: clean.footerDescriptionText,
        stats: clean.stats || [],
        navbarSettings: clean.navbarSettings || {},
        featuredStoryTitle: clean.featuredStoryTitle,
        featuredStoryText: clean.featuredStoryText,
        featuredStoryImage: clean.featuredStoryImage,
        featuredYouTubeUrl: clean.featuredYouTubeUrl || '',
        aboutGallery: clean.aboutGallery || [],
        lastUpdated: new Date().toISOString()
      });

      await setDoc(doc(db, DATA_COLLECTION, DOCS.CONTENT), {
        achievements: clean.achievements || [],
        initiatives: clean.initiatives || [],
        talents: clean.talents || [],
        projects: clean.projects || [],
        newborns: clean.newborns || [],
        newlyweds: clean.newlyweds || [],
        healthUpdates: clean.healthUpdates || [],
        healthSectionTitle: clean.healthSectionTitle || 'ركن العافية',
        quizQuestions: clean.quizQuestions || [],
        memoryGameImages: clean.memoryGameImages || [],
        adventureDoors: clean.adventureDoors || []
      });

      if (clean.familyTree) {
        await setDoc(doc(db, DATA_COLLECTION, DOCS.TREE), { familyTree: clean.familyTree });
      }
      
      if (clean.teamData) {
        await setDoc(doc(db, TEAM_COLLECTION, DOCS.TEAM), clean.teamData);
      }

      console.log("✅ All data synced to Firebase successfully");
      return true;
    } catch (e: any) {
      console.error("❌ Save Failed:", e.message);
      return false;
    }
  },

  async fetchSubmissions(): Promise<UpdateSubmission[]> {
    try {
      const querySnapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
      return querySnapshot.docs.map(doc => ({ ...(doc.data() as UpdateSubmission), id: doc.id }));
    } catch (e) { return []; }
  },

  async deleteSubmission(id: string): Promise<boolean> {
    try { await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, id)); return true; } catch (e) { return false; }
  },

  async saveSubmission(submission: Omit<UpdateSubmission, 'id' | 'status'>): Promise<boolean> {
    try { await addDoc(collection(db, SUBMISSIONS_COLLECTION), { ...submission, status: 'pending' }); return true; } catch (e) { return false; }
  }
};
