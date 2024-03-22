import app from './config';
import { getAuth, signOut, setPersistence, browserSessionPersistence, sendSignInLinkToEmail, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

// Initialize Auth
const auth = getAuth(app);