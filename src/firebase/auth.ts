import app from './config';
import { browserLocalPersistence, getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, setPersistence, signInWithEmailLink, signOut } from 'firebase/auth';

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
// TODO: fix any for auth parameter
// TODO: clean up code for proper type usage
const logInWithEmailLink = async (url: string, showPrompt: (title: string, onSubmitSuccess: (email: string, url: string) => Promise<void>, url: string) => void) => {
    setPersistence(auth, browserLocalPersistence);
    if(isSignInWithEmailLink(auth, url)) {
        const email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            showPrompt('Please provide your email for confirmation', logInWithEmailLinkCallback, url)
            return
        }
        await logInWithEmailLinkCallback(email, url)
    }
};
// should only exist in this file, do not export!
const logInWithEmailLinkCallback = async (email: string, url: string) => {
    await signInWithEmailLink(auth, email!, url)
        .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            const user = result.user;
            console.log(user)
            // possible check if user is new through result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
            console.error(error, error.code, error.message); // TODO: show error popup?
        });
}

// TODO: add signup function
// LT TODO: signup function, clean up code, refactor firestore paths to use quiz subcollection of user, add all error handling, if time refactor router to use switch between public and protected routes

const logOutUser = async () => {
    await signOut(auth)
};


export { auth, sendEmailLink, logInWithEmailLink, logOutUser };