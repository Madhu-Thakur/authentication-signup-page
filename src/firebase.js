import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration (you'll need to replace this with your actual Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyA_hJC0znbuzngNgXXx0qy47cZ8GOlfVl0",
  authDomain: "netflixgpt-d9389.firebaseapp.com",
  projectId: "netflixgpt-d9389",
  storageBucket: "netflixgpt-d9389.firebasestorage.app",
  messagingSenderId: "397051349340",
  appId: "1:397051349340:web:b79e3fe71bf44ff9e19999",
  measurementId: "G-16GNZ3PK2T"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };