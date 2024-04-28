//import {AnswerValue} from "./ConstrainedTypes.ts";
import { v4 as uuid } from "uuid";

export class Answer {
    // Properties
    public id: string
    public value: /*AnswerValue*/string
    public correct: boolean

    // Constructor
    constructor(correct: boolean, id?: string, value?: /*AnswerValue*/string) {
        this.id = id ?? uuid()
        this.value = value ?? ""
        this.correct = correct
    }

    static isEqual(a: Answer, b: Answer): boolean {
        return a.id === b.id
            && a.value === b.value
            && a.correct === b.correct
    }

    static areEqual(a: Answer[], b: Answer[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!Answer.isEqual(a[i],b[i])) return false;
        }
        return true;
    }
}