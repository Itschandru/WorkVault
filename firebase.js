// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTFW4_DrNnY6l40XcKMD_56zi1xpJomYM",
  authDomain: "workvault-35309.firebaseapp.com",
  projectId: "workvault-35309",
  storageBucket: "workvault-35309.firebasestorage.app",
  messagingSenderId: "555885273000",
  appId: "1:555885273000:web:15408c18d77bc8e5f5479d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
