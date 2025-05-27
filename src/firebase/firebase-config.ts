// Firebase v9+ Modular SDK
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKGIcQ8AktI_beAawHh8WbBLKcfsIkf3A",
  authDomain: "roofing-sales-app-76397.firebaseapp.com",
  projectId: "roofing-sales-app-76397",
  storageBucket: "roofing-sales-app-76397.firebasestorage.app",
  messagingSenderId: "568368669108",
  appId: "1:568368669108:web:de2ee1b80b3cd082f3d2e1",
  measurementId: "G-YNSBK3CRLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

export { app, db, auth }; 