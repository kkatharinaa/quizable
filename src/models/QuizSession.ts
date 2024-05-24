import QuizSessionState, {quizSessionStatesAreEqual} from "./QuizSessionState";

// Note how we use interface instead of class
// Classes are good for when you also want to give it some functionality
// interface are good to define how a data structure should look like
// since we do not need any methods for pre-processing the types, interfaces are great
// and a lot can be done functionally too.
export default interface QuizSession{
    id: string,
    quizId: string,
    state: QuizSessionState,
    hostId: string
}

export const quizSessionsAreEqual = (a: QuizSession, b: QuizSession): boolean => {
    return a.id === b.id
        && a.quizId === b.quizId
        && quizSessionStatesAreEqual(a.state, b.state)
        && a.hostId === b.hostId
}