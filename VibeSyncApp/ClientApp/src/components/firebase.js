// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from './Constants';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging();

export const requestForToken = () => {
    return getToken(messaging, { vapidKey: 'BIZe19kreVsinHyUgkkzI_lozq48GprMV3zXifOD2GVL7uI6-VFRjR_cYYDtK_jUHC6ZB37ObeB5CALLs1qYtk4' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                localStorage.setItem('fcm', currentToken);
                return currentToken; // Return the token to the caller
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                return null;
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("payload", payload)
            resolve(payload);
        });
    });

