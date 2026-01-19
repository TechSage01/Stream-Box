import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgunabcwp_LM-efbOay1G__pZFKkkwBwI",
  authDomain: "streambox-f3b5e.firebaseapp.com",
  projectId: "streambox-f3b5e",
  storageBucket: "streambox-f3b5e.firebasestorage.app",
  messagingSenderId: "867448342678",
  appId: "1:867448342678:web:6a62d88dd31e30b90ddab7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
