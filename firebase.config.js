// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase config for NeuraMed
export const firebaseConfig = {
  apiKey: "AIzaSyCVYvDv8DxR8xT-bwA3Ex30JDv4S8hxuqg",
  authDomain: "neura-85f84.firebaseapp.com",
  projectId: "neura-85f84",
  storageBucket: "neura-85f84.firebasestorage.app",
  messagingSenderId: "792991317237",
  appId: "1:792991317237:web:0f5f3106a4e91cb00699bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;