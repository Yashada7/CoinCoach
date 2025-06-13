import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNsQ5NhfKmCr6T45GGl-TiFWq9EOsxyJs",
  authDomain: "coincoach-f7908.firebaseapp.com",
  projectId: "coincoach-f7908",
  storageBucket: "coincoach-f7908.appspot.com",
  messagingSenderId: "888376275355",
  appId: "1:888376275355:web:2264cecfd433e9e536b13e",
  measurementId: "G-JDMBK4KWEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (Only on Client-Side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, analytics };
