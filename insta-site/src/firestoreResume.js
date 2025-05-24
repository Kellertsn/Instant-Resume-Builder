import { db } from './firebase';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

// 儲存履歷
export async function saveResume(data) {
  const docRef = await addDoc(collection(db, "resumes"), data);
  return docRef.id; // 回傳ID
}

// 載入履歷
export async function loadResume(id) {
  const docRef = doc(db, "resumes", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}
