import "firebase/firestore";
import QuizSession from "../models/QuizSession";

export default class QuizSessionService{
    static port: number = 5296
    // static url: string = `http://localhost:${this.port}`
    static url: string = `https://quizapp-rueasghvla-nw.a.run.app`

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

    public static async isQuizCodeValid(quizCode: string): Promise<{valid: boolean, sessionId: string}> {
        const textReturn: string = await (await fetch(`${this.url}/api/session/validate/${quizCode}`)).text()
        return {valid: textReturn != "", sessionId: textReturn};
    }

    public static async getSession(): Promise<QuizSession>{
        return await (await fetch(`${this.url}/api/session`)).json()
    }

}