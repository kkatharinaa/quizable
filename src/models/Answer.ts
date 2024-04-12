import {AnswerValue} from "./ConstrainedTypes.ts";

// TODO: move somewhere else? / adjust so it fits everyone's needs
export class Answer {
    // Properties
    public id: string // TODO: should this be a uuid? guid? or string?
    public value: AnswerValue
    public correct: boolean

    static default =  new Answer("0", AnswerValue.tryMake("Green")!, false)

    // Constructor
    constructor(id: string, value: AnswerValue, correct: boolean) {
        this.id = id
        this.value = value
        this.correct = correct
    }
}