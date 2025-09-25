// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7cBhTKEHy1Du73HgEdzYXPT_Aj_JiA-g",
  authDomain: "eat-explore-amazing-treats.firebaseapp.com",
  projectId: "eat-explore-amazing-treats",
  storageBucket: "eat-explore-amazing-treats.firebasestorage.app",
  messagingSenderId: "982310743160",
  appId: "1:982310743160:web:0410ccbc9fc7944329118d"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Initialize Firebase
// const analytics = getAnalytics(app);