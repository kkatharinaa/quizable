import { initializeApp } from 'firebase/app';

const env_var = import.meta.env


const firebaseConfig = {
  apiKey: env_var.VITE_API_KEY,
  authDomain: env_var.VITE_AUTH_DOMAIN,
  databaseURL: env_var.VITE_DATABASE_URL,
  projectId: env_var.VITE_PROJECT_ID,
  storageBucket: env_var.VITE_STORAGE_BUCKET,
  messagingSenderId: env_var.VITE_MESSAGING_SENDER_ID,
  appId: env_var.VITE_APP_ID,
  measurementId: env_var.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;