// 1. These MUST be the exact same version (10.8.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Replace these dummy values with your actual keys from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-J4RNxNL1YSe2lVXpyy6qngnYSf1SLXY",
  authDomain: "aatmoday-bfae5.firebaseapp.com",
  projectId: "aatmoday-bfae5",
  storageBucket: "aatmoday-bfae5.firebasestorage.app",
  messagingSenderId: "553224328710",
  appId: "1:553224328710:web:8817c6b7bff073fe615587"
};

// 3. Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, addDoc };