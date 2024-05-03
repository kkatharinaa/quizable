import {NavigateFunction} from "react-router-dom";

export enum ErrorPageLinkedTo {
    Home = "Home",
    Overview = "Overview"
}

export const getErrorPageLinkedTo = (value: string): ErrorPageLinkedTo | undefined => {
    return Object.values(ErrorPageLinkedTo).find((key) => ErrorPageLinkedTo[key] === value) as ErrorPageLinkedTo;
}

export const showErrorQuizSessionNotRunning = (navigate: NavigateFunction, isHost: boolean) => {
    const message = isHost ? "You are currently not in an active quiz session. Start playing a quiz from your quizzes overview screen." : "You are not logged in."
    const linkTo = isHost ? ErrorPageLinkedTo.Overview : ErrorPageLinkedTo.Home;
    navigate(`/error?message=${encodeURIComponent(message)}&linkTo=${encodeURIComponent(linkTo)}`);
}