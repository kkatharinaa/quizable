import "firebase/firestore";
import QuizSession from "../models/QuizSession";

export default class QuizSessionService{
    static port: number = 5296
    static url: string = `http://localhost:${this.port}`


    public static async setSession(quizSession: QuizSession): Promise<number> {
        console.log(JSON.stringify(quizSession))
        return (await fetch(`${this.url}/api/session`, 
        {
            method: "POST", 
            body: JSON.stringify(quizSession),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })).status
    }

    public static async getSession(): Promise<QuizSession>{
        return await (await fetch(`${this.url}/api/session`)).json()
    }
}