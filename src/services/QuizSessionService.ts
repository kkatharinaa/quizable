import "firebase/firestore";
import QuizSession from "../models/QuizSession";
import QuizUser from "../models/QuizUser";

export default class QuizSessionService{
    static port: number = 5296
    static url: string = `http://localhost:${this.port}`
    // static url: string = `https://quizapp-rueasghvla-nw.a.run.app`

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

    public static async checkQuizUserAlreadyExists(quizSessionId: string, quizUserIdentifier: string): Promise<boolean> {
        const quizUserExistResponse: Response = await (
            await fetch(`${this.url}/api/session/user/${quizSessionId}/${quizUserIdentifier}`)
        )

        console.log("Status code: " + quizUserExistResponse.status)

        if(quizUserExistResponse.status == 404){
            console.log("User not found ... valid username")
            return false;  
        }
        else if (quizUserExistResponse.status == 400)
            return false;
                
        return true;
    }

    public static async getSession(): Promise<QuizSession>{
        return await (await fetch(`${this.url}/api/session`)).json()
    }

}