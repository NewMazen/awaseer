
import { GameScore } from "../types";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, getDocs } from "firebase/firestore";

const SCORES_COLLECTION = 'gameScores';

export const saveGameScoreToFirebase = async (score: GameScore) => {
    try {
        const colRef = collection(db, SCORES_COLLECTION);
        await addDoc(colRef, {
            ...score,
            createdAt: new Date().toISOString()
        });
        console.log("Score saved to Firestore ✅");
    } catch (error) {
        console.error("Error saving score to Firestore ❌", error);
    }
};

export const listenToGameScores = (callback: (scores: GameScore[]) => void) => {
    try {
        const colRef = collection(db, SCORES_COLLECTION);
        const q = query(colRef, orderBy('score', 'desc'));
        
        return onSnapshot(q, (snapshot) => {
            const scores: GameScore[] = [];
            snapshot.forEach((doc) => {
                scores.push({ ...doc.data() } as GameScore);
            });
            callback(scores);
        });
    } catch (error) {
        console.error("Error listening to scores ❌", error);
        return () => {};
    }
};

export const clearAllScores = async () => {
    try {
        const colRef = collection(db, SCORES_COLLECTION);
        const querySnapshot = await getDocs(colRef);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log("All scores cleared ✅");
    } catch (error) {
        console.error("Error clearing scores ❌", error);
    }
};
