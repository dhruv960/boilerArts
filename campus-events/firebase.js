// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmQs6vMK-KCexZZ8nnCfgjEFXDieTYpsk",
  authDomain: "campus-events-6a017.firebaseapp.com",
  projectId: "campus-events-6a017",
  storageBucket: "campus-events-6a017.firebasestorage.app",
  messagingSenderId: "239345209707",
  appId: "1:239345209707:web:1e7d6f0b71f8243bc7fc2e",
  measurementId: "G-REEZMT3H75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
