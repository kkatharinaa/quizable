import {Email} from "./ConstrainedTypes.ts";
import {v4 as uuid} from "uuid";

export interface AuthenticatedUser {
    id: string;
    email: Email;
    autoSendLog: boolean
}

// TODO: remove once authentication gets added
export const defaultAuthenticatedUser: AuthenticatedUser = {
    id: uuid(),
    email: Email.tryMake("user@email.com")!,
    autoSendLog: true
}