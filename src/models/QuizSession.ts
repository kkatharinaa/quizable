import QuizSessionState from "./QuizSessionState";


// TODO: Note how we use interface instead of class
// Classes are good for when you also want to give it some functionality
// interface are good to define how a data structure should look like
// since we do not need any methods for pre-processing the types, interfaces are great
// and a lot can be done functionally too.
export default interface QuizSession{
    id: string,
    quizId: string,
    state: QuizSessionState,
    deviceId: string,
}

/* export const DefaultQuizSession: QuizSession = () => {

} */