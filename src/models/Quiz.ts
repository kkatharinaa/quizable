//import {QuizName} from "./ConstrainedTypes.ts";
import {makeQuizOptions, QuizOptions, quizOptionsAreEqual} from "./QuizOptions.ts";
import {AuthenticatedUser, authUsersAreEqual} from "./AuthenticatedUser.ts";
import {makeQuestion, Question, questionArraysAreEqual} from "./Question.ts";
import { v4 as uuid } from "uuid";

export interface Quiz {
    id: string,
    name: /*QuizName*/string,
    questions: Question[],
    options: QuizOptions,
    quizUser: AuthenticatedUser,
    createdOn: Date,
    lastTimePlayed: Date | null
}

export const makeQuiz = (quizUser: AuthenticatedUser, id?: string, name?: /*QuizName*/string, questions?: Question[], options?: QuizOptions, createdOn?: Date, lastTimePlayed?: Date | null): Quiz => {
    return {
        id: id ?? uuid(),
        name: name ?? "",
        questions: questions ?? [makeQuestion()],
        options: options ?? makeQuizOptions(),
        quizUser: quizUser,
        createdOn: createdOn ?? new Date(),
        lastTimePlayed: lastTimePlayed ?? null
    }
}

export const quizzesAreEqual = (a: Quiz, b: Quiz): boolean => {
    return a.id === b.id
        && a.name === b.name
        && questionArraysAreEqual(a.questions, b.questions)
        && quizOptionsAreEqual(a.options, b.options)
        && authUsersAreEqual(a.quizUser, b.quizUser)
        && a.createdOn === b.createdOn
        && a.lastTimePlayed === b.lastTimePlayed
}