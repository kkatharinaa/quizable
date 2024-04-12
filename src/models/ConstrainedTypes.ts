
// TODO: is this fine? or use zod?

export class QuizName {
    private constructor(public readonly value: string) {}

    static tryMake(input: string): QuizName | null {
        if (input.length === 0) return null
        // TODO: check for max characters?
        return new QuizName(input)
    }
}

// eg. for question name
export class QuestionName {
    private constructor(public readonly value: string) {}

    static tryMake(input: string): QuestionName | null {
        if (input.length === 0) return null
        // TODO: check for max characters
        return new QuestionName(input)
    }
}

export class AnswerValue {
    // could be adjusted to accommodate more answer types
    private constructor(public readonly value: string) {}

    static tryMake(input: string): AnswerValue | null {
        if (input.length === 0) return null
        // TODO: check for max characters
        return new AnswerValue(input)
    }
}

export class Email {
    private constructor(public readonly value: string) {}

    static tryMake(input: string): Email | null {
        if (input.length === 0) return null
        // TODO: check if fits email criteria
        return new Email(input)
    }
}