import QuizSession, {quizSessionsAreEqual} from "../models/QuizSession.ts";
import * as SignalR from "@microsoft/signalr";
import QuizUser, {quizUsersAreEqual} from "../models/QuizUser.ts";
import {Question, questionsAreEqual} from "../models/Question.ts";
import QuizSessionUserStats from "../models/QuizSessionUserStats.ts";
import {isEqualNullable} from "../helper/EqualHelpers.ts";
import {Answer} from "../models/Answer.ts";
import QuizSessionService from "../services/QuizSessionService.ts";
import {QuizState} from "../models/QuizSessionState.ts";
import {QuizSessionStatus} from "./QuizSessionManager.tsx";

export interface QuizSessionManagerSlaveInterface {
    quizSession: QuizSession | null;
    connection: SignalR.HubConnection | null;
    quizState: string | null;
    currentQuestionId: string | null;
    currentQuestion: Question | null;
    userStats: QuizSessionUserStats[] | null;
    sessionExists: boolean;
    quizUser: QuizUser | null;
    remainingTime: number;
    errorGettingSession: QuizSessionStatus;
}

export class QuizSessionManagerSlave implements QuizSessionManagerSlaveInterface {
    private static instance: QuizSessionManagerSlave;
    private _quizSession: QuizSession | null = null;
    private _currentQuestion: Question | null = null;
    private _connection: SignalR.HubConnection | null = null;
    private _quizUser: QuizUser | null = null;
    private _remainingTime: number = 0;
    private _errorGettingSession: QuizSessionStatus = QuizSessionStatus.Ok

    private subscribers: ((quizSessionManagerSlave: QuizSessionManagerSlave) => void)[] = [];

    private constructor() {}

    public static getInstance(): QuizSessionManagerSlave {
        if (!QuizSessionManagerSlave.instance) {
            QuizSessionManagerSlave.instance = new QuizSessionManagerSlave();
        }
        return QuizSessionManagerSlave.instance;
    }

    public static getInstanceAsInterface(): QuizSessionManagerSlaveInterface {
        const instance = this.getInstance();
        return {
            quizSession: instance.quizSession,
            connection: instance.connection,
            quizState: instance.quizState,
            currentQuestionId: instance.currentQuestionId,
            currentQuestion: instance.currentQuestion,
            userStats: instance.userStats,
            sessionExists: instance.sessionExists,
            quizUser: instance.quizUser,
            remainingTime: instance.remainingTime,
            errorGettingSession: instance.errorGettingSession
        }
    }

    public isEqual(other: QuizSessionManagerSlave): boolean {
        // Check if all properties are equal
        return (
            isEqualNullable(this.quizSession, other.quizSession, quizSessionsAreEqual) &&
            isEqualNullable(this.currentQuestion, other.currentQuestion, questionsAreEqual) &&
            this._connection === other._connection &&
            isEqualNullable(this.quizUser, other.quizUser, quizUsersAreEqual),
            this._remainingTime === other._remainingTime
        );
    }

    // getters
    public get quizSession(): QuizSession | null {
        return this._quizSession;
    }
    public get connection(): SignalR.HubConnection | null {
        return this._connection;
    }
    public get quizState(): string | null {
        if (this._quizSession == null) return null
        return  this._quizSession.state.currentQuizState
    }
    public get currentQuestionId(): string | null {
        if (this._quizSession == null) return null
        return  this._quizSession.state.currentQuestionId
    }
    public get currentQuestion(): Question | null {
        return this._currentQuestion
    }
    public get userStats(): QuizSessionUserStats[] | null {
        if (this._quizSession == null) return null
        return this._quizSession?.state.usersStats
    }
    public get sessionExists(): boolean {
        return this._quizSession != null &&
            this._connection != null
    }
    public get quizUser(): QuizUser | null {
        return this._quizUser;
    }
    public get remainingTime(): number {
        return this._remainingTime;
    }
    public get errorGettingSession(): QuizSessionStatus {
        return this._errorGettingSession;
    }

    // setters
    public set quizSession(quizSession: QuizSession) {
        this._quizSession = quizSession;
        this.notifySubscribers()
    }
    public set connection(connection: SignalR.HubConnection) {
        this._connection = connection;
        this.notifySubscribers()
    }
    public set currentQuestion(question: Question) {
        this._currentQuestion = question;
        this.notifySubscribers()
    }
    public set quizUser(quizUser: QuizUser) {
        this._quizUser = quizUser;
        this.notifySubscribers()
    }
    public set errorGettingSession(errorGettingSession: QuizSessionStatus) {
        this._errorGettingSession = errorGettingSession;
        this.notifySubscribers()
    }

    // functions
    public killSession(): void {
        // kill connection to session on the server
        this._connection?.send("LeaveQuizSession", this._quizUser, this._quizSession?.id, true);
        this.resetManager()
    }
    private resetManager(): void {
        if (this.quizState == QuizState.lobby) {
            localStorage.removeItem('quizSessionId');
            localStorage.removeItem('quizUser');
        }

        this._quizSession = null;
        this._currentQuestion = null;
        this._connection = null;
        this._quizUser = null;
        this._errorGettingSession = QuizSessionStatus.Ok;
        this.notifySubscribers()
    }
    public selectAnswer(answer: Answer): void {
        this._connection?.send("NotifySlaveAnswered", this._quizUser, this._quizSession?.id, this._currentQuestion?.id, answer);
    }
    public async setUp(quizSessionId: string, quizUser: QuizUser): Promise<void> {
        this._connection = await this.initSignalR(quizSessionId, quizUser)
        this._quizUser = quizUser;
        this.notifySubscribers();

        // save the quizsession id and the username in the localstorage to let host reconnect on same device
        localStorage.setItem('quizSessionId', quizSessionId);
        localStorage.setItem('quizUser', JSON.stringify(quizUser));
    }
    private async initSignalR(quizSessionId: string, quizUser: QuizUser): Promise<SignalR.HubConnection> {
        // start websocket connection
        const url: string = QuizSessionService.url

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/slave", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
            })
            .build();

        connection.on(`sessionrequest:${quizSessionId}/${quizUser.identifier}`, (message: QuizSession, currentQuestion: Question) => {
            this._quizSession = message
            this._currentQuestion = currentQuestion
            this.notifySubscribers()
        })
        connection.on(`nosession:${quizSessionId}/${quizUser.identifier}`, () => {
            console.log("no session")
            this._errorGettingSession = QuizSessionStatus.NoSession
            this.notifySubscribers()
            this.resetManager()
        })

        connection.on(`statechange:${quizSessionId}/${quizUser.identifier}`, (state: string, currentQuestion: Question) => {
            console.log("state change")
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, currentQuizState: state, currentQuestionId: currentQuestion.id}};
            this._currentQuestion = currentQuestion
            this.notifySubscribers()
        })

        connection.on(`questionend:${quizSessionId}/${quizUser.identifier}`, (quizUserStats: QuizSessionUserStats[], state: string) => {
            if (this._quizSession == null) return
            this._quizSession = ({...this._quizSession, state: {...this._quizSession.state, currentQuizState: state, usersStats: quizUserStats}})
            this.notifySubscribers()
        })

        connection.on(`answer:${quizSessionId}/${quizUser.identifier}`, (quizUserStats: QuizSessionUserStats[]) => {
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, usersStats: quizUserStats}}
            this.notifySubscribers()
        })

        connection.on(`userchange:${quizSessionId}/${quizUser.identifier}`, (quizUserStats: QuizSessionUserStats[]) => {
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, usersStats: quizUserStats}}
            this.notifySubscribers()
        })

        connection.on(`timerchange:${quizSessionId}/${quizUser.identifier}`, (remainingSeconds: number) => {
            this._remainingTime = remainingSeconds
            this.notifySubscribers()
        })

        connection.start()
            .then(async () => {
                connection.invoke('GetConnectionId')
                    .then((connectionId: string) => {
                        console.log("Connection ID: " + connectionId)
                        connection?.send("NotifySlaveEnterQuiz", connectionId, quizUser, quizSessionId)
                    })
            })
            .catch((err) => console.error(err))

        connection.onclose((error: Error | undefined) => {
            console.error('SignalR connection closed. ', error);
            this._errorGettingSession = QuizSessionStatus.ConnectionClosed
            this.notifySubscribers()
        })

        return connection
    }

    // subscriber stuff
    public subscribe(callback: (quizSessionManagerSlave: QuizSessionManagerSlave) => void) {
        this.subscribers.push(callback);
    }
    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this));
    }
    public unsubscribe(callback: (quizSessionManagerSlave: QuizSessionManagerSlave) => void) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }
}