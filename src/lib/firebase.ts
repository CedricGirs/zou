
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6smpgK5qHKTgAG1onwx0pMEMygi5j25g",
  authDomain: "app-zou.firebaseapp.com",
  projectId: "app-zou",
  storageBucket: "app-zou.firebasestorage.app",
  messagingSenderId: "723164442030",
  appId: "1:723164442030:web:1fa818947d514312e12c3f"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
