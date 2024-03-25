import app from './config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// import { collection, onSnapshot, addDoc, Timestamp, updateDoc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore(app);

const getUserDocument = async (uid: string) => {
    if (!uid) return null;
    const userDocumentReference = doc(db, 'users', uid);
    const userDocument = await getDoc(userDocumentReference);

    if (userDocument.exists()) {
        return userDocument.data();
    } else {
        console.log('Uid is invalid.');
        return null;
    }
};

export { getUserDocument };