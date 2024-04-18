import app from "../firebase/config";
import {DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where} from "firebase/firestore"
import "firebase/firestore";
import { Quiz } from "../models/Quiz";
import { v4 as uuid } from "uuid";

const db = getFirestore(app);

const toJson = (instance: unknown) => {
    return JSON.parse(JSON.stringify(instance))
}

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

    static getById = async (quizSessionId: string) => {
        await query(this.quizCollection, where('id','==',quizSessionId))
    }
}