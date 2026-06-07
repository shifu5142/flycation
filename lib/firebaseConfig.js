// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0pAl1DOFLDChniPrejhoG1KE1gP9t1QI",
  authDomain: "flyvaction.firebaseapp.com",
  projectId: "flyvaction",
  storageBucket: "flyvaction.firebasestorage.app",
  messagingSenderId: "255700432595",
  appId: "1:255700432595:web:12151f762c593faf2f0626",
  measurementId: "G-W6LNX29QBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();