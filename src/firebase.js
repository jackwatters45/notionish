import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBNnpWZTNAVKXK4zTfouN56WQTRDxCxt6E',
  authDomain: 'todo-list-a011b.firebaseapp.com',
  projectId: 'todo-list-a011b',
  storageBucket: 'todo-list-a011b.appspot.com',
  messagingSenderId: '323379183752',
  appId: '1:323379183752:web:19bdf58c96e1845df25f3d',
  measurementId: 'G-PTSHL9VR0E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
