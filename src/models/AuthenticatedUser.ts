
// TODO: move somewhere else? / adjust so it fits everyone's needs
import {Email} from "./ConstrainedTypes.ts";

export class AuthenticatedUser {
    // Properties
    public id: string // TODO: should this be a uuid? guid? or string?
    public email: Email
    public autoSendLog: boolean

    static default = new AuthenticatedUser("0", Email.tryMake("user@email.com")!, true)

    // Constructor
    constructor(id: string, email: Email, autoSendLog: boolean) {
        this.id = id
        this.email = email
        this.autoSendLog = autoSendLog
    }
}