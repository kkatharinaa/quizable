import QuizSession, {quizSessionsAreEqual} from "../models/QuizSession.ts";
import {Quiz, quizzesAreEqual} from "../models/Quiz.ts";
import * as SignalR from "@microsoft/signalr";
import QuizUser from "../models/QuizUser.ts";
import {v4 as uuid} from "uuid";
import {getDeviceId} from "../helper/DeviceHelper.ts";
import {Question} from "../models/Question.ts";
import QuizSessionUserStats from "../models/QuizSessionUserStats.ts";
import {isEqualNullable} from "../helper/EqualHelpers.ts";
import {AuthenticatedUser, authUsersAreEqual} from "../models/AuthenticatedUser.ts";

export interface QuizSessionManagerInterface {
    quizSession: QuizSession | null;
    quiz: Quiz | null;
    quizCode: string;
    connection: SignalR.HubConnection | null;
    host: AuthenticatedUser | null;
    quizState: string | null;
    currentQuestionId: string | null;
    currentQuestion: Question | null;
    currentQuestionIsFirstQuestion: boolean;
    userStats: QuizSessionUserStats[] | null;
    userStatsOrderedByScore: QuizSessionUserStats[] | null;
    userStatsOrderedByScoreWithoutCurrentQuestion: QuizSessionUserStats[] | null;
    sessionExists: boolean;
    canSendReport: boolean;
    remainingTime: number;
}

export class QuizSessionManager implements QuizSessionManagerInterface {
    private static instance: QuizSessionManager;
    private _quizSession: QuizSession | null = null;
    private _quiz: Quiz | null = null;
    private _quizCode: string = "";
    private _connection: SignalR.HubConnection | null = null;
    private _canSendReport: boolean = true;
    private _host: AuthenticatedUser | null = null;
    private _remainingTime: number = 0;

    private subscribers: ((quizSessionManager: QuizSessionManager) => void)[] = [];

    private constructor() {}

    public static getInstance(): QuizSessionManager {
        if (!QuizSessionManager.instance) {
            QuizSessionManager.instance = new QuizSessionManager();
        }
        return QuizSessionManager.instance;
    }

    public static getInstanceAsInterface(): QuizSessionManagerInterface {
        const instance = this.getInstance();
        return {
            quizSession: instance.quizSession,
            quiz: instance.quiz,
            quizCode: instance.quizCode,
            connection: instance.connection,
            host: instance.host,
            quizState: instance.quizState,
            currentQuestionId: instance.currentQuestionId,
            currentQuestion: instance.currentQuestion,
            currentQuestionIsFirstQuestion: instance.currentQuestionIsFirstQuestion,
            userStats: instance.userStats,
            userStatsOrderedByScore: instance.userStatsOrderedByScore,
            userStatsOrderedByScoreWithoutCurrentQuestion: instance.userStatsOrderedByScoreWithoutCurrentQuestion,
            sessionExists: instance.sessionExists,
            canSendReport: instance.canSendReport,
            remainingTime: instance.remainingTime,
        }
    }

    public isEqual(other: QuizSessionManager): boolean {
        // Check if all properties are equal
        return (
            isEqualNullable(this.quizSession, other.quizSession, quizSessionsAreEqual) &&
            isEqualNullable(this.quiz, other.quiz, quizzesAreEqual) &&
            this._quizCode === other._quizCode &&
            this._connection === other._connection &&
            isEqualNullable(this._host, other._host, authUsersAreEqual) &&
            this._remainingTime === other._remainingTime
        );
    }

    // getters
    public get quizSession(): QuizSession | null {
        return this._quizSession;
    }
    public get quiz(): Quiz | null {
        return this._quiz;
    }
    public get quizCode(): string {
        return this._quizCode;
    }
    public get connection(): SignalR.HubConnection | null {
        return this._connection;
    }
    public get host(): AuthenticatedUser | null {
        return this._host;
    }
    public get remainingTime(): number {
        return this._remainingTime;
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
        if (this._quiz == null || this._quizSession == null) return null
        return this._quiz?.questions.find(question => question.id == this._quizSession?.state.currentQuestionId) ?? null
    }
    public get currentQuestionIsFirstQuestion(): boolean {
        const currentQuestion = this._quiz?.questions.find(question => question.id == this._quizSession?.state.currentQuestionId) ?? null
        const firstQuestion = this._quiz?.questions[0]
        return currentQuestion?.id === firstQuestion?.id;
    }
    public get userStats(): QuizSessionUserStats[] | null {
        if (this._quizSession == null) return null
        return this._quizSession?.state.usersStats
    }
    public get userStatsOrderedByScore(): QuizSessionUserStats[] | null {
        if (this._quizSession == null) return null
        return this._quizSession?.state.usersStats.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            } else {
                // If scores are equal, sort alphabetically by user id
                return a.user.identifier.localeCompare(b.user.identifier);
            }
        })
    }
    public get userStatsOrderedByScoreWithoutCurrentQuestion(): QuizSessionUserStats[] | null {
        // this function is necessary so that we can display on the leaderboard if users moved up or down on the leaderboard or if they stayed in the same spot within the ranking
        if (this._quizSession == null) return null
        const usersStatsCopy: QuizSessionUserStats[] = this._quizSession!.state.usersStats.map(stats => ({ ...stats }));
        usersStatsCopy.forEach(stats => {
            const pointsReceivedForCurrentQuestion = stats.answers
                .filter(answer => answer.questionId === this._quizSession?.state.currentQuestionId)
                .reduce((total, answer) => total + answer.pointsReceived, 0);

            stats.score -= pointsReceivedForCurrentQuestion;
        });
        return usersStatsCopy.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            } else {
                // If scores are equal, sort alphabetically by user id
                return a.user.identifier.localeCompare(b.user.identifier);
            }
        })
    }
    public get sessionExists(): boolean {
        return this._quizSession != null &&
            this._quiz != null &&
            this._quizCode != "" &&
            this._connection != null
    }
    public get canSendReport(): boolean {
        return this._canSendReport
    }

    // setters
    public set quizSession(quizSession: QuizSession) {
        this._quizSession = quizSession;
        this.notifySubscribers()
    }
    public set quiz(quiz: Quiz) {
        this._quiz = quiz;
        this.notifySubscribers()
    }
    public set quizCode(quizCode: string) {
        this._quizCode = quizCode;
        this.notifySubscribers()
    }
    public set connection(connection: SignalR.HubConnection) {
        this._connection = connection;
        this.notifySubscribers()
    }
    public set host(host: AuthenticatedUser) {
        this._host = host;
        this.notifySubscribers()
    }

    // functions
    public killSession(): void {
        // kill session on the server
        this._connection?.send("NotifyKillQuiz", this._quizSession?.id)

        this._quizSession = null;
        this._quiz = null;
        this._quizCode = "";
        this._connection = null;
        this._host = null;
        this._canSendReport = true;
        this._remainingTime = 0;
        this.notifySubscribers()
    }
    public changeState(newState: string): void {
        this._connection?.send("NotifyStateChange", this._quizSession?.id, newState)
    }
    public toNextQuestionOrEnd(isFirstQuestion: boolean): void {
        this._connection?.send("NotifyPlayQuiz", this._quizSession?.id, isFirstQuestion)
    }
    public skipQuestion(): void {
        this._connection?.send("NotifyQuestionSkip", this._quizSession?.id)
    }
    public sendReport(): void {
        this._connection?.send("SendReportToEmail", this._quizSession?.id, this._host?.email.value, this._quiz?.name)
        this._canSendReport = false
        this.notifySubscribers()
    }
    public async setUp(quizSessionId: string, host: AuthenticatedUser, quiz: Quiz): Promise<void> {
        this._quiz =  quiz
        this._host = host
        this._connection = await this.initSignalR(quizSessionId, host.id)
        this.notifySubscribers();
    }
    private async initSignalR(quizSessionId: string, hostUserId: string): Promise<SignalR.HubConnection> {
        // start websocket connection
        const port: number = 5296
        const url: string = `http://localhost:${port}`
        // const url: string = `https://quizapp-rueasghvla-nw.a.run.app`

        const connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(url + "/master", {
                skipNegotiation: true,
                transport: SignalR.HttpTransportType.WebSockets
            })
            .build();

        connection.on(hostUserId, (quizEntryId: string, message: QuizSession) => {
            this._quizCode = quizEntryId
            this._quizSession = message
            this.notifySubscribers()
        })

        connection.on(`statechange:${hostUserId}`, (state: string, currentQuestionId: string) => {
            if (this._quizSession == null) return
            this._quizSession = ({...this._quizSession, state: {...this._quizSession.state, currentQuizState: state, currentQuestionId: currentQuestionId}});
            this.notifySubscribers()
        })

        connection.on(`questionend:${hostUserId}`, (quizUserStats: QuizSessionUserStats[], state: string) => {
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, currentQuizState: state, usersStats: quizUserStats}}
            this._remainingTime = 0
            this.notifySubscribers()
        })

        connection.on(`answer:${hostUserId}`, (quizUserStats: QuizSessionUserStats[]) => {
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, usersStats: quizUserStats}}
            this.notifySubscribers()
        })

        connection.on(`timerchange:${hostUserId}`, (remainingSeconds: number) => {
            this._remainingTime = remainingSeconds
            this.notifySubscribers()
        })

        connection.on(`userjoined:${hostUserId}`, (quizUserStats: QuizSessionUserStats[]) => {
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, usersStats: quizUserStats}}
            console.log("Lost the connection!")
            this.notifySubscribers()
        })

        // basically the same as userjoined
        // TODO: merge userjoined and userleft
        connection.on(`userleft:${hostUserId}`, (quizUserStats: QuizSessionUserStats[]) => {
            if (this._quizSession == null) return
            this._quizSession = {...this._quizSession, state: {...this._quizSession.state, usersStats: quizUserStats}}
            this.notifySubscribers()
        })

        connection.on(`canResendReport:${hostUserId}`, () => {
            this._canSendReport = true
            this.notifySubscribers()
        })

        connection.start()
            .then(async () => {
                const quizUser: QuizUser = {
                    id: uuid(),
                    identifier: hostUserId,
                    deviceId: await getDeviceId()
                }
                connection.send("requestQuizSession", quizUser, quizSessionId)
            })
            .catch((err) => console.error(err))

        return connection
    }

    // subscriber stuff
    public subscribe(callback: (quizSessionManager: QuizSessionManager) => void) {
        this.subscribers.push(callback);
    }
    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this));
    }
    public unsubscribe(callback: (quizSessionManager: QuizSessionManager) => void) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }
}