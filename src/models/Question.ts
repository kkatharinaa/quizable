import {QuestionName} from "./ConstrainedTypes.ts";
import {QuestionType} from "./Enums.ts";
import {Answer} from "./Answer.ts";

// TODO: move somewhere else? / adjust so it fits everyone's needs
export class Question {
    // Properties
    public id: string // TODO: should this be a uuid? guid? or string?
    public questionText: QuestionName
    public answers: Answer[]
    public maxQuestionTime: number // if 0, the time allowed for this question will be unlimited, unless overridden by quiz isTimeForPoints toggle
    public questionPoints: number
    public questionPointsModifier: number // if 0, no points will be deducted if the user takes longer to answer
    public questionType: QuestionType
    public showLiveStats: boolean

    static default: Question = new Question("0", QuestionName.tryMake("Which colour is the sky?")!, [Answer.default, Answer.default], 0, 100, 0, QuestionType.SingleChoice, false)

    // Constructor
    constructor(id: string, questionText: QuestionName, answers: Answer[], maxQuestionTime: number, questionPoints: number, questionPointsModifier: number, questionType: QuestionType, showLiveStats: boolean) {
        this.id = id
        this.questionText = questionText
        this.answers = answers
        this.maxQuestionTime = maxQuestionTime
        this.questionPoints = questionPoints
        this.questionPointsModifier = questionPointsModifier
        this.questionType = questionType
        this.showLiveStats = showLiveStats
    }
}