// firebaseConfig.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // ✅ Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAuVS_cC44ltSZ3MNz47Jv-bhsfpRq8k5Q",
  authDomain: "ngofood-26a44.firebaseapp.com",
  projectId: "ngofood-26a44",
  storageBucket: "ngofood-26a44.appspot.com", // ✅ FIXED typo: was ".com", should be ".appspot.com"
  messagingSenderId: "991983742598",
  appId: "1:991983742598:web:7f2a15b2567c5e8ac92b07",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

import { getStorage } from 'firebase/storage';
const storage = getStorage(app);

export { auth, db, storage };
