import app from './config';
import { getFirestore, doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore(app);

// Gets the user document from the database
const getUserDocument = async (uid: string) => {
    const userDocumentReference = doc(db, 'users', uid);
    const userDocument = await getDoc(userDocumentReference);

    if (userDocument.exists()) {
        return userDocument.data();
    } else {
        console.log('Cannot get user.');
        return null;
    }
};

// Gets the whole collection of quizzes for a user
const getUserQuizzes = async (uid: string) => {
    const userDocumentReference = doc(db, 'users', uid);
    const quizCollectionReference = collection(userDocumentReference, 'quizzes');
    const quizCollection = await getDocs(quizCollectionReference);

    quizCollection.forEach((doc) => {
        if (doc.exists()) {
            return doc.data();
        } else {
            console.log('Cannot get quiz.');
            return null;
        }
    });
};

/* Uses onSnapshot to capture a stream of the session and work with it. 
Might be better to implement this more into the frontend, or in a separate file. */

const getSessionDocument = async (sessionid: string) => {
    const sessionDocumentReference = doc(db, 'sessions', sessionid);
    // const sessionDocument = await getDoc(sessionDocumentReference);

    // if (sessionDocument.exists()) {
    //     return sessionDocument.data();
    // } else {
    //     console.log('Cannot get session.');
    //     return null;
    // }

    return onSnapshot(sessionDocumentReference, (session) => {
        if (session.exists()) {
            return session.data();
        } else {
            console.log('Cannot get session.');
            return null;
        }
    });
};

export { getUserDocument, getUserQuizzes, getSessionDocument };