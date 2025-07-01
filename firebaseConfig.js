// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBFXGjwk1Ayoj2FgZEsfzcCehOPMV1nY4",
  authDomain: "eat-app-f88a2.firebaseapp.com",
  projectId: "eat-app-f88a2",
  storageBucket: "eat-app-f88a2.firebasestorage.app",
  messagingSenderId: "490170836660",
  appId: "1:490170836660:web:ecd3b4fd5917da5fb499e1",
  measurementId: "G-HFTLRNJ1NT"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Initialize Firebase
// const analytics = getAnalytics(app);