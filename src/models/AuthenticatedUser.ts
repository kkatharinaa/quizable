import {Email} from "./ConstrainedTypes.ts";
import {v4 as uuid} from "uuid";

export class AuthenticatedUser {
    // Properties
    public id: string
    public email: Email
    public autoSendLog: boolean

    static default = new AuthenticatedUser(uuid(), Email.tryMake("user@email.com")!, true)

    // Constructor
    constructor(id: string, email: Email, autoSendLog: boolean) {
        this.id = id
        this.email = email
        this.autoSendLog = autoSendLog
    }
}