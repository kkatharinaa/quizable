import {Email} from "./ConstrainedTypes.ts";

export interface AuthenticatedUser {
    id: string;
    email: Email;
    autoSendLog: boolean
}

// TODO: remove once authentication gets added
export const defaultAuthenticatedUser: AuthenticatedUser = {
    id: "userId1",
    email: Email.tryMake("user@email.com")!,
    autoSendLog: true
}

export const authUsersAreEqual = (a: AuthenticatedUser, b: AuthenticatedUser): boolean => {
    return a.id === b.id
        && a.email.value === b.email.value
        && a.autoSendLog === b.autoSendLog
}