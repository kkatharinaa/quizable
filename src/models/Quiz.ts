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

    // Constructor
    constructor(id?: string, name?: /*QuizName*/string, questions?: Question[], options?: QuizOptions, quizUser?: AuthenticatedUser, createdOn?: Date, lastTimePlayed?: Date | null) {
        this.id = id ?? uuid()
        this.name = name ?? ""
        this.questions = questions ?? [new Question()]
        this.options = options ?? new QuizOptions()
        this.quizUser = quizUser ?? AuthenticatedUser.default // TODO: remove default when authentication gets added
        this.createdOn = createdOn ?? new Date()
        this.lastTimePlayed = lastTimePlayed ?? null
    }
}