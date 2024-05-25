import app from "../firebase/config";
import {collection, doc, getFirestore, setDoc, query, where} from "firebase/firestore"
import "firebase/firestore";
import QuizSession from "../models/QuizSession";
import { Quiz } from "../models/Quiz";
import { v4 as uuid } from "uuid";
import { getDeviceId } from "../helper/DeviceHelper";

const db = getFirestore(app);

const toJson = (instance: unknown) => {
    return JSON.parse(JSON.stringify(instance))
} 

export default class QuizSessionRepository{
    static quizSessionCollection = collection(db, 'quiz_session');
    static getQuizSessionDocument = (id?: string) => doc(this.quizSessionCollection, id ?? uuid())

    // adds and instance of Quiz Session to the firestore
    static add = async (quizSession: QuizSession) => {
        await setDoc(this.getQuizSessionDocument(quizSession.id), toJson(quizSession))
    }

    static create = async (quiz: Quiz) => {
        const newQuizSession: QuizSession = {
            id: uuid(),
            quizId: quiz.id,
            hostId: await getDeviceId(),
            state: {
                currentQuestionId: quiz.questions[0].id,    // start with the first question at the begining
                usersStats: [],
                currentQuizState: "lobby"
            }
        }
        await this.add(newQuizSession)
        return newQuizSession
    }

    static addQuizSession = async (quizSession: QuizSession) => {
        await setDoc(this.getQuizSessionDocument(), quizSession)
    }

    static getQuizSessionById = async (quizSessionId: string) => {
        await query(this.quizSessionCollection, where('id','==',quizSessionId))
    }
}