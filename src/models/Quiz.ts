import {ColourScheme} from "./Enums.ts";
import {QuizName} from "./ConstrainedTypes.ts";
import {QuizOptions} from "./QuizOptions.ts";
import {AuthenticatedUser} from "./AuthenticatedUser.ts";
import {Question} from "./Question.ts";

// TODO: move somewhere else? / adjust so it fits everyone's needs
export class Quiz {
    // Properties
    public id: string // TODO: should this be a uuid? guid? or string?
    public name: QuizName
    public questions: Question[]
    public options: QuizOptions
    public quizUser: AuthenticatedUser
    public createdOn: Date // TODO: adjust so it can be used with Firebase
    public lastTimePlayed: Date | null // TODO: adjust so it can be used with Firebase
    public colourScheme: ColourScheme

    static default: Quiz = new Quiz("0", QuizName.tryMake("Untitled Quiz")!, [Question.default, Question.default], QuizOptions.default, AuthenticatedUser.default, new Date(), null, ColourScheme.Default)

    // Constructor
    constructor(id: string, name: QuizName, questions: Question[], options: QuizOptions, quizUser: AuthenticatedUser, createdOn: Date, lastTimePlayed: Date | null, colourScheme: ColourScheme) {
        this.id = id
        this.name = name
        this.questions = questions
        this.options = options
        this.quizUser = quizUser
        this.createdOn = createdOn
        this.lastTimePlayed = lastTimePlayed
        this.colourScheme = colourScheme
    }
}