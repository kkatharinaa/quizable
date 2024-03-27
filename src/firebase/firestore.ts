import app from './config';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

// import { onSnapshot, addDoc, Timestamp, updateDoc } from 'firebase/firestore';

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

const getUserQuizzes = async (uid: string) => {
    if (!uid) return null;
    const userDocumentReference = doc(db, 'users', uid);
    const quizCollectionReference = collection(userDocumentReference, 'quizzes');
    const quizCollection = await getDocs(quizCollectionReference);

    quizCollection.forEach((doc) => {
        if (doc.exists()) {
            return doc.data();
        } else {
            console.log('Cannot find quiz');
            return null;
        }
    });
};

export { getUserDocument, getUserQuizzes };