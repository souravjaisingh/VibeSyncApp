// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWp-o6Eki3kX1jidSdNWOodisINdfoQrw",
    authDomain: "vibesync-428906.firebaseapp.com",
    projectId: "vibesync-428906",
    storageBucket: "vibesync-428906.appspot.com",
    messagingSenderId: "856720085870",
    appId: "1:856720085870:web:e48b903204842ccd3f277f",
    measurementId: "G-7R0FVYC3Q4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging();

export const requestForToken = () => {
    return getToken(messaging, { vapidKey: 'BIZe19kreVsinHyUgkkzI_lozq48GprMV3zXifOD2GVL7uI6VFRjR_cYYDtK_jUHC6ZB37ObeB5CALLs1qYtk4' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                // Perform any other neccessary action with the token
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
      .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
};