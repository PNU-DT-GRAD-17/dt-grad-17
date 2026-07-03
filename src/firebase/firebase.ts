import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKaYGvQxJINo-8X1_TMAXTd73JG7aE664",
  authDomain: "dt-grad-17.firebaseapp.com",
  projectId: "dt-grad-17",
  storageBucket: "dt-grad-17.firebasestorage.app",
  messagingSenderId: "67306938484",
  appId: "1:67306938484:web:edbe686c68cccab6833121",
  measurementId: "G-PMT5BEKLS7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);