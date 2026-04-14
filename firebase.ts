// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error('Missing Firebase environment variables. Check your .env.local file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/** Secondary app: crear cuentas email/contraseña sin desloguear al admin en la app principal */
const staffProvisionApp = initializeApp(firebaseConfig, "InverlanStaffProvision");

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const secondaryAuth = getAuth(staffProvisionApp);

export default app;
