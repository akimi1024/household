// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7VDFzWm0grgRLZzuniiFpk7lDfyH2gII",
  authDomain: "householdtypescript-a78eb.firebaseapp.com",
  projectId: "householdtypescript-a78eb",
  storageBucket: "householdtypescript-a78eb.firebasestorage.app",
  messagingSenderId: "729276778360",
  appId: "1:729276778360:web:f5ec6eb720d2d3a6c8ea8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };