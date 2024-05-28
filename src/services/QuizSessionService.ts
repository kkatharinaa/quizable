import "firebase/firestore";
import QuizSession from "../models/QuizSession";
import { Question } from "../models/Question";
import QuizUser from "../models/QuizUser";

const env_var = import.meta.env

export default class QuizSessionService{
   
    //static port: number = 5296
    //static url: string = `http://localhost:${this.port}`
    public static url: string = env_var.VITE_API_URL

    public static async addSession(quizSession: QuizSession): Promise<string> {
        return (await fetch(`${this.url}/api/session`, 
        {
            method: "POST", 
            body: JSON.stringify(quizSession),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })).text()
    }

    public static async addQuestionsToSession(quizSessionId: string, questions: Question[]) {
        return (await fetch(`${this.url}/api/session/${quizSessionId}/questions`, 
        {
            method: "POST", 
            body: JSON.stringify(questions),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }))
    }

    public static async isQuizCodeValid(quizCode: string): Promise<{valid: boolean, sessionId: string}> {
        const textReturn: string = await (await fetch(`${this.url}/api/session/validate/${quizCode}`)).text()
        return {valid: textReturn != "Code is not valid.", sessionId: textReturn};
    }

    public static async checkQuizUserAlreadyExists(quizSessionId: string, quizUserIdentifier: string): Promise<{userExists: boolean, user?: QuizUser, status: number}> {
        const quizUserExistResponse: Response = await (
            await fetch(`${this.url}/api/session/user/${quizSessionId}/${quizUserIdentifier}`)
        )

        // Bad request
        if (quizUserExistResponse.status === 400) { // bad request
            return { userExists: false, status: 400 };
        } else if (quizUserExistResponse.status === 409) { // conflict - quizuser exists already
            return { userExists: true, status: 409 };
        } else if (quizUserExistResponse.status === 200) { // ok - either comes with a quizuser when that user is disconnected and can be reclaimed, or doesn't when the user is completely free
            try {
                const quizUser: QuizUser = await quizUserExistResponse.json();
                return { userExists: true, user: quizUser, status: 200 };
            } catch (error) {
                return { userExists: false, status: 200 };
            }
        } else {
            throw new Error('Unexpected response status: ' + quizUserExistResponse.status);
        }
    }

    public static async getSession(): Promise<QuizSession> {
        return await (await fetch(`${this.url}/api/session`)).json()
    }

    public static async checkQuizUserReconnection(deviceId: string): Promise<{quizUser: QuizUser, quizSession: QuizSession}|null> {
        return fetch(`${this.url}/api/session/device/${deviceId}`)
            .then((text) => text.json())
            .catch(() => null)
    }

    public static async checkHostReconnection(hostId: string): Promise<QuizSession|null> {
        return fetch(`${this.url}/api/session/host/${hostId}`)
            .then((text) => text.json())
            .catch(() => null)
    }
}