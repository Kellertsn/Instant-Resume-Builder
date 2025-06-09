// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHE4_Wi-0P1Mq_C_WzIkrxZOReN0AJWMM",
  authDomain: "instant-resume-builder-2d74b.firebaseapp.com",
  projectId: "instant-resume-builder-2d74b",
  storageBucket: "instant-resume-builder-2d74b.appspot.com",
  messagingSenderId: "597770366790",
  appId: "1:597770366790:web:6bc43f00539c4e926c3f47",
  measurementId: "G-HE4S4F7T26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore with enhanced settings and offline persistence
// 使用新的API設置離線持久化和多標籤支持
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// 注意：不再需要單獨調用enableIndexedDbPersistence和settings方法
// 離線持久化和緩存大小已經在initializeFirestore中設置