// Import the functions you need from the SDKs you need
// src/firebase.ts
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions"; // If using Cloud Functions later

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC_LrrHB90fRUMXNkqSHswWeQQv6Tls6EQ",
    authDomain: "plio-cb051.firebaseapp.com",
    projectId: "plio-cb051",
    storageBucket: "plio-cb051.firebasestorage.app",
    messagingSenderId: "1051182495734",
    appId: "1:1051182495734:web:693d6957824912ca7ff9d7",
    measurementId: "G-PZ8QCL3Y3Z"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Get Functions instance (optional, for later)
const functions = getFunctions(app);
// You might need to specify the region if not us-central1
// const functions = getFunctions(app, 'your-region');

// Export the instances you need in other components
export { db, functions, app }; // Export app if needed elsewhere