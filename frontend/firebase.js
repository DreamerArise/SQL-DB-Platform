// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9Vpn7fnHn0n_778XgOCpBh1Wfvx24srU",
  authDomain: "db-platform-6614e.firebaseapp.com",
  projectId: "db-platform-6614e",
  storageBucket: "db-platform-6614e.firebasestorage.app",
  messagingSenderId: "676355843429",
  appId: "1:676355843429:web:dc6531881dd34aca792d8c",
  measurementId: "G-JPX4PXSQHR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, storage }; // Assure-toi d'exporter storage
