// firebase.js — SUKUMARBEVERAGES Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsWmOSn0IK3w9--ou7e8n6lXXJDzUgTEM",
  authDomain: "sukumarbeverages.firebaseapp.com",
  projectId: "sukumarbeverages",
  storageBucket: "sukumarbeverages.firebasestorage.app",
  messagingSenderId: "214277296794",
  appId: "1:214277296794:web:7906688c38248bf783c523",
  measurementId: "G-1F4YPL693J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
