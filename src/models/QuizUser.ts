export default interface QuizUser {
    id: string;
    identifier: string;
    deviceId: string;
}

export const quizUsersAreEqual = (a: QuizUser, b: QuizUser): boolean => {
    return a.id === b.id
        && a.identifier === b.identifier
        && a.deviceId === b.deviceId
}


