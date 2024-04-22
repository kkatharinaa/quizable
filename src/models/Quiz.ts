//import {QuizName} from "./ConstrainedTypes.ts";
import {QuizOptions} from "./QuizOptions.ts";
import {AuthenticatedUser} from "./AuthenticatedUser.ts";
import {Question} from "./Question.ts";
import { v4 as uuid } from "uuid";

export class Quiz {
    // Properties
    public id: string
    public name: /*QuizName*/string
    public questions: Question[]
    public options: QuizOptions
    public quizUser: AuthenticatedUser
    public createdOn: Date
    public lastTimePlayed: Date | null

    static default: Quiz = new Quiz(uuid(), /*QuizName.tryMake("Untitled Quiz")!*/"", [Question.default], QuizOptions.default, AuthenticatedUser.default, new Date(), null)

    // Constructor
    constructor(id: string, name: /*QuizName*/string, questions: Question[], options: QuizOptions, quizUser: AuthenticatedUser, createdOn: Date, lastTimePlayed: Date | null) {
        this.id = id
        this.name = name
        this.questions = questions
        this.options = options
        this.quizUser = quizUser
        this.createdOn = createdOn
        this.lastTimePlayed = lastTimePlayed
    }
}