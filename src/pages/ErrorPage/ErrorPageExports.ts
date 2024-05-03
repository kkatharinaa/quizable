import {NavigateFunction} from "react-router-dom";

export enum ErrorPageLinkedTo {
    Home = "Home",
    Overview = "Overview",
    Join = "Join",
}

export const getErrorPageLinkedTo = (value: string): ErrorPageLinkedTo | undefined => {
    return Object.values(ErrorPageLinkedTo).find((key) => ErrorPageLinkedTo[key] === value) as ErrorPageLinkedTo;
}

export const showErrorQuizSessionNotRunning = (navigate: NavigateFunction, isHost: boolean) => {
    const message = isHost ? "You are currently not in an active quiz session. Start playing a quiz from your quizzes overview screen." : "You are not logged in."
    const linkTo = isHost ? ErrorPageLinkedTo.Overview : ErrorPageLinkedTo.Home;
    showErrorPage(navigate, message, linkTo)
}
export const showErrorNotInSession = (navigate: NavigateFunction) => {
    const message = "You are not a player in this quiz session. The button below will take you to the correct screen on which you can join any active quiz session."
    const linkTo = ErrorPageLinkedTo.Join
    showErrorPage(navigate, message, linkTo)
}

export const showErrorPageNothingToFind = (navigate: NavigateFunction, linkTo?: ErrorPageLinkedTo) => {
    const message = "Oops, nothing to find here."
    showErrorPage(navigate, message, linkTo ?? ErrorPageLinkedTo.Home)
}
export const showErrorPageSomethingWentWrong = (navigate: NavigateFunction, linkTo?: ErrorPageLinkedTo) => {
    const message = "Looks like something went wrong. Please try again later or contact us if the issue persists."
    showErrorPage(navigate, message, linkTo ?? ErrorPageLinkedTo.Home)
}

export const showErrorPage = (navigate: NavigateFunction, message: string, linkTo: ErrorPageLinkedTo) => {
    navigate(`/error?message=${encodeURIComponent(message)}&linkTo=${encodeURIComponent(linkTo)}`);
}