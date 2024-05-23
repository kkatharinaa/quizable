import app from "../firebase/config";
import {QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDoc, getDocs, getFirestore, setDoc, deleteDoc} from "firebase/firestore"
import "firebase/firestore";
import { Quiz } from "../models/Quiz";
import { v4 as uuid } from "uuid";
import {AuthenticatedUser} from "../models/AuthenticatedUser.ts";

const db = getFirestore(app);

const toJson = (instance: unknown) => {
    return JSON.parse(JSON.stringify(instance))
}

export default class QuizRepository {
    static usersCollection = collection(db, 'users');
    static quizCollection = (userId: string) => collection(db, `users/${userId}/quizzes`)
    static getUserDocument = (path?: string) => doc(this.usersCollection, path ?? uuid())
    static getQuizDocument = (userId: string, path?: string) => doc(this.quizCollection(userId), path ?? uuid())

    static addUser = async (user: AuthenticatedUser) => {
        await setDoc(this.getUserDocument(user.id), toJson(user))
    }
    static getUser = async (userId: string) => {
        const docRef = doc(this.usersCollection.firestore, this.usersCollection.path, userId)
        const docSnap = await getDoc(docRef);

        return docSnap.data() as AuthenticatedUser;
    }

    static add = async (userId: string, quiz: Quiz) => {
        await setDoc(this.getQuizDocument(userId, quiz.id), toJson(quiz))
    }

    static getAll = async (userId: string): Promise<Quiz[]> =>  {
        const querySnapshot: QuerySnapshot = await getDocs(QuizRepository.quizCollection(userId))
        const docs: QueryDocumentSnapshot[] = querySnapshot.docs
        const quizzes: Quiz[] = docs.map((doc: QueryDocumentSnapshot) => doc.data() as Quiz)

        return quizzes;
    }

    static getById = async (userId: string, id: string): Promise<Quiz> => {
        const docRef = doc(this.quizCollection(userId).firestore, this.quizCollection(userId).path, id)
        const docSnap = await getDoc(docRef);

        return docSnap.data() as Quiz;
    }

    static delete = async (userId: string, id: string): Promise<void> => {
        const docRef = doc(this.quizCollection(userId).firestore, this.quizCollection(userId).path, id)
        return await deleteDoc(docRef)
    }
}