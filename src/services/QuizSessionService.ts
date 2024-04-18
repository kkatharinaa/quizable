import QuizSession from "../models/QuizSession";

export default class QuizSessionService {
    static url: string = "https://localhost:7257"

    public static async setSession(quizSession: QuizSession): Promise<number> {
        return (await fetch(`${this.url}/api/session`, 
        {
            method: "POST", 
            body: JSON.stringify(quizSession),
            headers: {
                'Content-Type': 'application/json'
            }
        })).status
    }

    public static async getSession(): Promise<QuizSession>{
        return await (await fetch(`${this.url}/api/session`)).json()
    }
}