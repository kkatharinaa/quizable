export interface AuthenticatedUser {
    id: string;
    email: string;
    autoSendLog: boolean
}

// TODO: remove once authentication gets added
export const defaultAuthenticatedUser: AuthenticatedUser = {
    id: "userId1",
    email: "user@email.com",
    autoSendLog: true
}

export const authUsersAreEqual = (a: AuthenticatedUser, b: AuthenticatedUser): boolean => {
    return a.id === b.id
        && a.email === b.email
        && a.autoSendLog === b.autoSendLog
}