import { initializeApp } from 'firebase/app';

const process = import.meta.env

console.log(process.VITE_API_KEY)


const firebaseConfig = {
  apiKey: process.API_KEY,
  authDomain: process.AUTH_DOMAIN,
  databaseURL: process.DATABASE_URL,
  projectId: process.PROJECT_ID,
  storageBucket: process.STORAGE_BUCKET,
  messagingSenderId: process.MESSAGING_SENDER_ID,
  appId: process.APP_ID,
  measurementId: process.MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;