import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration - DIRECT CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAj0L9gZQNcEbyJggHZJYdMk8RCZIVgVJQ",
  authDomain: "smart-study-planner-cse499.firebaseapp.com",
  projectId: "smart-study-planner-cse499",
  storageBucket: "smart-study-planner-cse499.firebasestorage.app",
  messagingSenderId: "629321985081",
  appId: "1:629321985081:web:00a35d3ea0cb131014f1e8"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Firebase persistence error:', error);
});

export { app, auth };