//import {AnswerValue} from "./ConstrainedTypes.ts";
import { v4 as uuid } from "uuid";

export interface Answer {
    id: string;
    value: string;
    correct: boolean;
}

export const makeAnswer = (correct?: boolean, value?: string, id?: string): Answer => {
    return {
        id: id ?? uuid(),
        value: value ?? "",
        correct: correct ?? false,
    }
}

export const answersAreEqual = (a: Answer, b: Answer): boolean => {
    return a.id === b.id
        && a.value === b.value
        && a.correct === b.correct
}

export const answerArraysAreEqual = (a: Answer[], b: Answer[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!answersAreEqual(a[i],b[i])) return false;
    }
    return true;
}