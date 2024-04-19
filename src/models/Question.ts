//import {QuestionName} from "./ConstrainedTypes.ts";
import {QuestionType} from "./Enums.ts";
import {Answer} from "./Answer.ts";
import { v4 as uuid } from "uuid";

export class Question {
    // Properties
    public id: string
    public questionText: /*QuestionName*/ string
    public answers: Answer[]
    public maxQuestionTime: number // if 0, the time allowed for this question will be unlimited
    public questionPoints: number
    public questionPointsModifier: number // if 0, no points will be deducted if the user takes longer to answer
    public questionType: QuestionType
    public showLiveStats: boolean

    static default: Question = new Question(uuid(), /*QuestionName.tryMake("Which colour is the sky?")!*/"", [Answer.defaultCorrect, Answer.default], 0, 100, 0, QuestionType.SingleChoice, false)

    // Constructor
    constructor(id: string, questionText: /*QuestionName*/string, answers: Answer[], maxQuestionTime: number, questionPoints: number, questionPointsModifier: number, questionType: QuestionType, showLiveStats: boolean) {
        this.id = id
        this.questionText = questionText
        this.answers = answers
        this.maxQuestionTime = maxQuestionTime
        this.questionPoints = questionPoints
        this.questionPointsModifier = questionPointsModifier
        this.questionType = questionType
        this.showLiveStats = showLiveStats
    }

    static isEqual(a: Question, b: Question): boolean {
        return a.id === b.id
            && a.questionText === b.questionText
            && Answer.areEqual(a.answers, b.answers)
            && a.maxQuestionTime === b.maxQuestionTime
            && a.questionPoints === b.questionPoints
            && a.questionPointsModifier === b.questionPointsModifier
            && a.questionType === b.questionType
            && a.showLiveStats === b.showLiveStats
    }

    static areEqual(a: Question[], b: Question[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!Question.isEqual(a[i],b[i])) return false;
        }
        return true;
    }
}