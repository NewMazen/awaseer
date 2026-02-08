
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const part1 = "AIzaSyDgNDH";
const part2 = "hAa0kgTADcPx";
const part3 = "7oW6z1K2qJDjQ5m0";

const appPart1 = "1:256314526877";
const appPart2 = ":web:b8bb6deafb6";
const appPart3 = "ec1e104d874";

const firebaseConfig = {
  apiKey: part1 + part2 + part3,
  authDomain: "awaseer-6945e.firebaseapp.com",
  projectId: "awaseer-6945e",
  storageBucket: "awaseer-6945e.appspot.com",
  messagingSenderId: "256314526877",
  appId: appPart1 + appPart2 + appPart3,
  measurementId: "G-6LMXS0KTFF"
};

// تهيئة التطبيق
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * تهيئة Firestore مع إعدادات متقدمة للاتصال:
 * 1. experimentalForceLongPolling: يحل مشكلة الـ 10 ثواني في الشبكات المقيدة.
 * 2. localCache: يتيح عمل الموقع في وضع الأوفلاين بشكل تلقائي.
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = getAuth(app);
export const storage = null;
