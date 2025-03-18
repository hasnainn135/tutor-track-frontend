
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAclvLDGv7oi3KhEXZptppajuR5Sg-P0QQ",
  authDomain: "tutortrack-c59a4.firebaseapp.com",
  projectId: "tutortrack-c59a4",
  storageBucket: "tutortrack-c59a4.firebasestorage.app",
  messagingSenderId: "243749231730",
  appId: "1:243749231730:web:4c7855e56a0e022b7eb6eb"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);