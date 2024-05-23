export interface AuthenticatedUser {
    id: string;
    email: string;
    autoSendLog: boolean
}

export const authUsersAreEqual = (a: AuthenticatedUser, b: AuthenticatedUser): boolean => {
    return a.id === b.id
        && a.email === b.email
        && a.autoSendLog === b.autoSendLog
}

export const isAuthenticatedUser = (object: any): object is AuthenticatedUser => {
    return (
        typeof object === "object" &&
        typeof object.id === "string" &&
        typeof object.email === "string" &&
        typeof object.autoSendLog === "boolean"
    )
}