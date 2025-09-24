// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmNiK_SHhm6WwL-P8zwUm4E9GxkSOi4SE",
  authDomain: "inverland-portal.firebaseapp.com",
  projectId: "inverland-portal",
  storageBucket: "inverland-portal.firebasestorage.app",
  messagingSenderId: "1033785562131",
  appId: "1:1033785562131:web:4129fdc09952da2e2f1be6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
