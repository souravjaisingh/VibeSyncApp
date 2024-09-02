// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAWp-o6Eki3kX1jidSdNWOodisINdfoQrw",
    authDomain: "vibesync-428906.firebaseapp.com",
    projectId: "vibesync-428906",
    storageBucket: "vibesync-428906.appspot.com",
    messagingSenderId: "856720085870",
    appId: "1:856720085870:web:e48b903204842ccd3f277f",
    measurementId: "G-7R0FVYC3Q4"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});