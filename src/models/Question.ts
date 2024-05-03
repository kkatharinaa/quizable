//import {QuestionName} from "./ConstrainedTypes.ts";
import {Answer, answerArraysAreEqual, makeAnswer} from "./Answer.ts";
import { v4 as uuid } from "uuid";

export enum QuestionType {
    SingleChoice,
}

export interface Question {
    id: string
    questionText: /*QuestionName*/ string
    answers: Answer[]
    maxQuestionTime: number // if 0, the time allowed for this question will be unlimited
    questionPoints: number
    questionPointsModifier: number // if 0, no points will be deducted if the user takes longer to answer
    questionType: QuestionType
    showLiveStats: boolean
}

export const makeQuestion = (id?: string, questionText?: /*QuestionName*/string, answers?: Answer[], maxQuestionTime?: number, questionPoints?: number, questionPointsModifier?: number, questionType?: QuestionType, showLiveStats?: boolean): Question => {
    return {
        id: id ?? uuid(),
        questionText: questionText ?? "",
        answers: answers ?? [makeAnswer(true), makeAnswer()],
        maxQuestionTime: maxQuestionTime ?? 60,
        questionPoints: questionPoints ?? 100,
        questionPointsModifier: questionPointsModifier ?? 0,
        questionType: questionType ?? QuestionType.SingleChoice,
        showLiveStats: showLiveStats ?? false
    }
}

export const questionsAreEqual = (a: Question, b: Question): boolean => {
    return a.id === b.id
        && a.questionText === b.questionText
        && answerArraysAreEqual(a.answers, b.answers)
        && a.maxQuestionTime === b.maxQuestionTime
        && a.questionPoints === b.questionPoints
        && a.questionPointsModifier === b.questionPointsModifier
        && a.questionType === b.questionType
        && a.showLiveStats === b.showLiveStats
}

export const questionArraysAreEqual = (a: Question[], b: Question[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!questionsAreEqual(a[i],b[i])) return false;
    }
    return true;
}