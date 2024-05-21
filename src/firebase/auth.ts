import app from './config';
import { browserLocalPersistence, createUserWithEmailAndPassword, getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, setPersistence, signInWithEmailLink, signOut } from 'firebase/auth';
import QuizRepository from "../repositories/QuizRepository.ts";
import {AuthenticatedUser} from "../models/AuthenticatedUser.ts";

// Initialize Auth
const auth = getAuth(app);
// 3 parts - actioncodesettings, send link, login on sent link
// Action code settings
// TODO: replace with live domain
const actionCodeSettings = {
    url: 'http://localhost:5173/overview',
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
const logInWithEmailLink = async (url: string, showPrompt: (title: string, url: string, onSubmitSuccess: (email: string, url: string, onError: () => void) => Promise<void>, onError: () => void) => void, onError: () => void) => {
    setPersistence(auth, browserLocalPersistence);
    if(isSignInWithEmailLink(auth, url)) {
        const email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            showPrompt('Please provide your email for confirmation', url, logInWithEmailLinkCallback, onError)
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

export { auth, sendEmailLink, logInWithEmailLink, logOutUser };