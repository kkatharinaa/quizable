import app from "../firebase/config";
import {QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDoc, getDocs, getFirestore, setDoc, deleteDoc} from "firebase/firestore"
import "firebase/firestore";
import { Quiz } from "../models/Quiz";
import { v4 as uuid } from "uuid";

const db = getFirestore(app);

const toJson = (instance: unknown) => {
    return JSON.parse(JSON.stringify(instance))
}

// TODO: has to be refactored to have a different structure within firebase once the login gets added, so you only get the quizzes of a specific user
export default class QuizRepository {
    static quizCollection = collection(db, 'quiz');
    static getQuizDocument = (path?: string) => doc(this.quizCollection, path ?? uuid())

    static add = async (quiz: Quiz) => {
        console.log(JSON.parse(JSON.stringify(quiz)))
        await setDoc(this.getQuizDocument(quiz.id), toJson(quiz))
    }

    static getAll = async (): Promise<Quiz[]> =>  {
        const querySnapshot: QuerySnapshot = await getDocs(QuizRepository.quizCollection)
        const docs: QueryDocumentSnapshot[] = querySnapshot.docs
        const quizzes: Quiz[] = docs.map((doc: QueryDocumentSnapshot) => doc.data() as Quiz)

        return quizzes;
    }

    static getById = async (id: string): Promise<Quiz> => {
        const docRef = doc(this.quizCollection.firestore, this.quizCollection.path, id)
        const docSnap = await getDoc(docRef);

        return docSnap.data() as Quiz;
    }

    static delete = async (id: string): Promise<void> => {
        const docRef = doc(this.quizCollection.firestore, this.quizCollection.path, id)
        return await deleteDoc(docRef)
    }
}