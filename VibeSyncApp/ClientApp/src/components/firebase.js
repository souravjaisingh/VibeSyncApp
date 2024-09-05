// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from './Constants';
import { insertDeviceForNotification } from "./services/UserService";


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

                const deviceId = getOrCreateDeviceId();
                const djId = localStorage.getItem('DjId'); // Assuming DjId is stored in localStorage
                
                if (djId) {
                    const obj ={
                        djId : djId,
                        fcmToken : currentToken,
                        deviceId : deviceId
                    }
                    insertDeviceForNotification(obj);
                } else {
                    console.error('DjId not found in localStorage');
                }

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

const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = generateUUID(); // Generate a new UUID if not found
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
};

// Function to generate a UUID (version 4)
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
// Listen for token refresh
// onTokenRefresh(() => {
//     getToken(messaging, { vapidKey: 'BIZe19kreVsinHyUgkkzI_lozq48GprMV3zXifOD2GVL7uI6-VFRjR_cYYDtK_jUHC6ZB37ObeB5CALLs1qYtk4' })
//         .then((refreshedToken) => {
//             console.log('FCM token refreshed:', refreshedToken);
//             // Send the new token to your server and update it in the user database
//         })
//         .catch((error) => {
//             console.error('Unable to retrieve refreshed token ', error);
//         });
// });

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             console.log("payload", payload)

//             // Show a notification using the Notification API
//             if (payload.notification) {
//                 const { title, body, icon } = payload.notification;

//                 new Notification(title, {
//                     body: body,
//                     icon: icon || 'default-icon.png',
//                 });
//             }

//             resolve(payload);
//         });
//     });

