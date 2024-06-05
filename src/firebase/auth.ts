import app from './config';
import { browserLocalPersistence, createUserWithEmailAndPassword, getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, setPersistence, signInWithEmailLink, signOut } from 'firebase/auth';
import QuizRepository from "../repositories/QuizRepository.ts";
import {AuthenticatedUser} from "../models/AuthenticatedUser.ts";
import {PopupProps} from "../components/Popup/Popup.tsx";
import {BottomNavBarType} from "../components/BottomNavBar/BottomNavBarExports.ts";
import QuizSessionService from "../services/QuizSessionService.ts";

const env_var = import.meta.env

// Initialize Auth
const auth = getAuth(app);
// 3 parts - actioncodesettings, send link, login on sent link
// Action code settings
const actionCodeSettings = {
    url: env_var.VITE_AUTH_REDIRECT_URL,
    handleCodeInApp: true
};

// Send email link function
const sendEmailLink = async (email: string, successCallback?: () => void, failureCallback?: () => void) => {
    await setPersistence(auth, browserLocalPersistence);
    // replace register
    const password = 'password123';
    await createUserWithEmailAndPassword(auth, email!, password)
        .then((result) => {
            const user: AuthenticatedUser = {
                id: result.user.uid,
                email: email,
                autoSendLog: false,
            }
            QuizRepository.addUser(user)
            QuizSessionService.sendEmailOnRegister(email)
        })
        .catch((error) => {
            if(error.code == 'auth/email-already-in-use') {
                sendSignInLinkToEmailWrapper(email, successCallback, failureCallback)
            }
        });
};

// wrapper async function
const sendSignInLinkToEmailWrapper = async (email: string, successCallback?: () => void, failureCallback?: () => void) => {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            if (successCallback != undefined) successCallback()
        })
        .catch((error: any) => {
            console.error(error, error.code, error.message);
            if (failureCallback != undefined) failureCallback()
        });
};

// Signin with email link function
const logInWithEmailLink = async (url: string, onError: () => void, showPopup: (popup: PopupProps) => void, hidePopup: () => void) => {
    setPersistence(auth, browserLocalPersistence);
    if(isSignInWithEmailLink(auth, url)) {
        const email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            showPromptForEmailConfirmation(url, onError, showPopup, hidePopup)
            return
        }
        await logInWithEmailLinkCallback(email, url, onError)
    }
};

// should only exist in this file, do not export!
const logInWithEmailLinkCallback = async (email: string, url: string, onError: () => void) => {
    await signInWithEmailLink(auth, email!, url)
        .then(() => {
            window.localStorage.removeItem('emailForSignIn');
        })
        .catch((error) => {
            console.error(error, error.code, error.message);
            onError()
        });
};

const logOutUser = async () => {
    await signOut(auth)
};

const showPromptForEmailConfirmation = (url: string, onError: () => void, showPopup: (popup: PopupProps) => void, hidePopup: () => void) => {
    const promptPopup: PopupProps = {
        title: 'Please provide your email for confirmation',
        message: null,
        secondaryButtonText: "Cancel",
        secondaryButtonIcon: null,
        primaryButtonText: "Submit",
        primaryButtonIcon: null,
        type: BottomNavBarType.Default,
        onSecondaryClick: () => {
            hidePopup()
            onError()
        },
        onPrimaryClick: (inputValue: string) => {
            logInWithEmailLinkCallback(inputValue, url, onError).then(() => {
                hidePopup()
            })
        },
        isPrompt: true
    }
    showPopup(promptPopup)
}

export { auth, sendEmailLink, logInWithEmailLink, logOutUser, showPromptForEmailConfirmation };