import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWKeSh7g-sl0ls_HzjXarDhtx7_pZ5HXQ",
  authDomain: "blog-app-8d6ed.firebaseapp.com",
  projectId: "blog-app-8d6ed",
  storageBucket: "blog-app-8d6ed.appspot.com",
  messagingSenderId: "1051985250729",
  appId: "1:1051985250729:web:1ce46cc0ced3b2c6449cb8",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
