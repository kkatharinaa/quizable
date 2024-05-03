//import {QuizName} from "./ConstrainedTypes.ts";
import {makeQuizOptions, QuizOptions} from "./QuizOptions.ts";
import {AuthenticatedUser, defaultAuthenticatedUser} from "./AuthenticatedUser.ts";
import {makeQuestion, Question} from "./Question.ts";
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

export const makeQuiz = (id?: string, name?: /*QuizName*/string, questions?: Question[], options?: QuizOptions, quizUser?: AuthenticatedUser, createdOn?: Date, lastTimePlayed?: Date | null): Quiz => {
    return {
        id: id ?? uuid(),
        name: name ?? "",
        questions: questions ?? [makeQuestion()],
        options: options ?? makeQuizOptions(),
        quizUser: quizUser ?? defaultAuthenticatedUser, // TODO: remove default when authentication gets added
        createdOn: createdOn ?? new Date(),
        lastTimePlayed: lastTimePlayed ?? null
    }
}