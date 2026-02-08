// scoreService.ts
import { db } from "../firebaseConfig";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import { GameScore } from "../types";
import { getDocs, deleteDoc } from "firebase/firestore";

export const saveGameScoreToFirebase = async (score: GameScore) => {
    try {
        await addDoc(collection(db, "scores"), {
            ...score,
            createdAt: serverTimestamp()
        });
        console.log("Score saved to Firestore ✅");
    } catch (error) {
        console.error("Error saving score ❌", error);
    }
};

export const listenToGameScores = (callback: (scores: GameScore[]) => void) => {
  const q = query(
    collection(db, "scores"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const scores: GameScore[] = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        playerName: data.playerName,
        playerCategory: data.playerCategory || 'child',
        score: data.score,
        timeInSeconds: data.timeInSeconds,
        gameType: data.gameType,
        date: data.date,
      };
    });

    callback(scores);
  });
};

export const clearAllScores = async () => {
    const snapshot = await getDocs(collection(db, "scores"));
    const deletions = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletions);
};