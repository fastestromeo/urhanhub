import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxy2tUf_wXo9Kw4sjGii8bagSw0FycYKk",
  authDomain: "zillow-1af4e.firebaseapp.com",
  projectId: "zillow-1af4e",
  storageBucket: "zillow-1af4e.firebasestorage.app",
  messagingSenderId: "1067596860409",
  appId: "1:1067596860409:web:0d678196f01267acefcb28",
  measurementId: "G-M3NWTR27XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };
