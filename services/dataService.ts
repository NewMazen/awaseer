
import { AppData, UpdateSubmission } from '../types';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SUBMISSIONS_COLLECTION = 'submissions';

// خرائط المسارات الجديدة لتجنب حد الـ 1MB للمستند الواحد
const DOC_PATHS = {
  main: { col: 'app_settings', doc: 'main_config' },
  ui: { col: 'app_data', doc: 'ui_settings' },
  tree: { col: 'app_data', doc: 'family_tree' },
  team: { col: 'team_config', doc: 'team_main_data' },
  // تقسيم المحتوى الديناميكي
  content_old: { col: 'app_data', doc: 'dynamic_content' }, // للمحافظة على البيانات القديمة
  content_achievements: { col: 'app_data', doc: 'content_achievements' },
  content_initiatives: { col: 'app_data', doc: 'content_initiatives' },
  content_talents: { col: 'app_data', doc: 'content_talents' },
  content_projects: { col: 'app_data', doc: 'content_projects' },
  content_occasions: { col: 'app_data', doc: 'content_occasions' },
  content_misc: { col: 'app_data', doc: 'content_misc' }
};

export const dataService = {
  async fetchAppData(initialData: AppData): Promise<AppData> {
    try {
      // جلب كافة المستندات بما فيها القديم والجديد الموزع
      const [mainSnap, uiSnap, treeSnap, teamSnap, oldContentSnap, achSnap, initSnap, talSnap, projSnap, occSnap, miscSnap] = await Promise.all([
        getDoc(doc(db, DOC_PATHS.main.col, DOC_PATHS.main.doc)),
        getDoc(doc(db, DOC_PATHS.ui.col, DOC_PATHS.ui.doc)),
        getDoc(doc(db, DOC_PATHS.tree.col, DOC_PATHS.tree.doc)),
        getDoc(doc(db, DOC_PATHS.team.col, DOC_PATHS.team.doc)),
        getDoc(doc(db, DOC_PATHS.content_old.col, DOC_PATHS.content_old.doc)),
        getDoc(doc(db, DOC_PATHS.content_achievements.col, DOC_PATHS.content_achievements.doc)),
        getDoc(doc(db, DOC_PATHS.content_initiatives.col, DOC_PATHS.content_initiatives.doc)),
        getDoc(doc(db, DOC_PATHS.content_talents.col, DOC_PATHS.content_talents.doc)),
        getDoc(doc(db, DOC_PATHS.content_projects.col, DOC_PATHS.content_projects.doc)),
        getDoc(doc(db, DOC_PATHS.content_occasions.col, DOC_PATHS.content_occasions.doc)),
        getDoc(doc(db, DOC_PATHS.content_misc.col, DOC_PATHS.content_misc.doc))
      ]);

      const remoteData: Partial<AppData> = {
        ...(mainSnap.exists() ? mainSnap.data() : {}),
        ...(uiSnap.exists() ? uiSnap.data() : {}),
        ...(treeSnap.exists() ? treeSnap.data() : {}),
        ...(teamSnap.exists() ? teamSnap.data() : {}),
        // دمج المحتوى من المستند القديم (إذا وجد) ثم المستندات الجديدة (الأولوية للجديد)
        ...(oldContentSnap.exists() ? oldContentSnap.data() : {}),
        ...(achSnap.exists() ? achSnap.data() : {}),
        ...(initSnap.exists() ? initSnap.data() : {}),
        ...(talSnap.exists() ? talSnap.data() : {}),
        ...(projSnap.exists() ? projSnap.data() : {}),
        ...(occSnap.exists() ? occSnap.data() : {}),
        ...(miscSnap.exists() ? miscSnap.data() : {})
      };

      const hasAnyData = mainSnap.exists() || uiSnap.exists() || oldContentSnap.exists() || achSnap.exists();
      
      if (hasAnyData) {
        console.log("✅ Remote data loaded (Optimized Multi-doc structure)");
        return { ...initialData, ...remoteData };
      }
      
      return initialData;
    } catch (e) {
      console.error("❌ Firestore Fetch Error:", e);
      return initialData;
    }
  },

  async saveAppData(data: AppData): Promise<boolean> {
    try {
      const mainData = {
        magazineTitle: data.magazineTitle,
        magazineIssue: data.magazineIssue,
        magazineDate: data.magazineDate,
        heroWelcome: data.heroWelcome,
        heroIntro: data.heroIntro,
        founderName: data.founderName,
        founderLabel: data.founderLabel,
        familyLabel: data.familyLabel,
        familySubLabel: data.familySubLabel,
        founderBio: data.founderBio,
        founderImage: data.founderImage,
        gloryMusicUrl: data.gloryMusicUrl,
        featuredStoryTitle: data.featuredStoryTitle,
        featuredStoryText: data.featuredStoryText,
        featuredStoryImage: data.featuredStoryImage,
        featuredYouTubeUrl: data.featuredYouTubeUrl || '',
        healthSectionTitle: data.healthSectionTitle,
        footerRightsText: data.footerRightsText,
        footerHadithText: data.footerHadithText,
        footerDescriptionText: data.footerDescriptionText
      };

      const uiData = { navbarSettings: data.navbarSettings, stats: data.stats };
      const treeData = { familyTree: data.familyTree };
      const teamData = { teamData: data.teamData };

      // توزيع المحتوى الديناميكي على مستندات منفصلة لتجنب حد الـ 1MB
      const achData = { achievements: data.achievements };
      const initData = { initiatives: data.initiatives };
      const talData = { talents: data.talents };
      const projData = { projects: data.projects };
      const occData = { 
        newborns: data.newborns, 
        newlyweds: data.newlyweds, 
        healthUpdates: data.healthUpdates 
      };
      const miscData = { 
        aboutGallery: data.aboutGallery || [],
        quizQuestions: data.quizQuestions,
        memoryGameImages: data.memoryGameImages,
        adventureIntroAudioUrl: data.adventureIntroAudioUrl || '',
        adventureDoors: data.adventureDoors
      };

      await Promise.all([
        setDoc(doc(db, DOC_PATHS.main.col, DOC_PATHS.main.doc), mainData),
        setDoc(doc(db, DOC_PATHS.ui.col, DOC_PATHS.ui.doc), uiData),
        setDoc(doc(db, DOC_PATHS.tree.col, DOC_PATHS.tree.doc), treeData),
        setDoc(doc(db, DOC_PATHS.team.col, DOC_PATHS.team.doc), teamData),
        setDoc(doc(db, DOC_PATHS.content_achievements.col, DOC_PATHS.content_achievements.doc), achData),
        setDoc(doc(db, DOC_PATHS.content_initiatives.col, DOC_PATHS.content_initiatives.doc), initData),
        setDoc(doc(db, DOC_PATHS.content_talents.col, DOC_PATHS.content_talents.doc), talData),
        setDoc(doc(db, DOC_PATHS.content_projects.col, DOC_PATHS.content_projects.doc), projData),
        setDoc(doc(db, DOC_PATHS.content_occasions.col, DOC_PATHS.content_occasions.doc), occData),
        setDoc(doc(db, DOC_PATHS.content_misc.col, DOC_PATHS.content_misc.doc), miscData)
      ]);

      console.log("✅ Data saved to Firestore (Optimized Split Structure)");
      return true;
    } catch (e: any) {
      console.error("❌ Firestore Save Failed:", e.message);
      return false;
    }
  },

  async fetchSubmissions(): Promise<UpdateSubmission[]> {
    try {
      const colRef = collection(db, SUBMISSIONS_COLLECTION);
      const q = query(colRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const submissions: UpdateSubmission[] = [];
      querySnapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() } as UpdateSubmission);
      });
      return submissions;
    } catch (e) { 
      console.error("❌ Fetch Submissions Error:", e);
      return []; 
    }
  },

  async deleteSubmission(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, id));
      return true;
    } catch (e) { return false; }
  },

  async saveSubmission(submission: Omit<UpdateSubmission, 'id' | 'status'>): Promise<boolean> {
    try {
      const colRef = collection(db, SUBMISSIONS_COLLECTION);
      await addDoc(colRef, {
        ...submission,
        status: 'pending',
        timestamp: Date.now()
      });
      return true;
    } catch (e) { return false; }
  },

  /**
   * رفع ملف إلى Firebase Storage
   * @param file الملف المراد رفعه (Blob or File or base64 string)
   * @param path المسار في الاستورج (مثلاً 'images/filename.jpg')
   */
  async uploadFile(file: Blob | File | string, path: string): Promise<string> {
    if (!storage) throw new Error("Storage not initialized");
    
    let blob: Blob;
    if (typeof file === 'string' && file.startsWith('data:')) {
      // تحويل Base64 إلى Blob
      const response = await fetch(file);
      blob = await response.blob();
    } else if (typeof file === 'string') {
      throw new Error("Invalid file format: string must be base64 data URL");
    } else {
      blob = file;
    }

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
};
