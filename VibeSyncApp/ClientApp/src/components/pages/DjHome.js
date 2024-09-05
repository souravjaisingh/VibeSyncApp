import React from 'react';
import '../../App.css';
import '../Button.css'
import '../pages/DjHome.css';
import { DjTabs } from '../DjTabs';
import { Link } from 'react-router-dom';
import{ useEffect, useState } from 'react';
import { requestForToken } from '../firebase';

export default function DjHome() {
    const [notification, setNotification] = useState({ title: '', body: '' });

    const isAppleDevice = () => {
        return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    };

    const isInStandaloneMode = () => {
        return (window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
    };

    useEffect(() => {
        // console.log('first use Effect, isappledevice ' + isAppleDevice() + 'isPWA ' + isInStandaloneMode())
        if (!isAppleDevice() || isInStandaloneMode()) {
                Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await requestForToken();
                if (token) {
                    //localStorage.setItem('fcmToken', token); // Store FCM token in local storage
                    console.log('FCM Token stored in local storage');
                }
            } catch (err) {
                console.error('Failed to fetch FCM token:', err);
            }
        };

        if (!localStorage.getItem('fcm')) {
            console.log(localStorage.getItem('DjId'))
            fetchToken(); // Fetch token only if it's not already in localStorage
        }
        else if (isAppleDevice() && isInStandaloneMode()) { 
            console.log('On Apple device PWA')
            fetchToken();
        }
    }, []);

    // useEffect(() => {
    //     onMessageListener()
    //         .then(payload => {
    //             setNotification({
    //                 title: payload.notification.title,
    //                 body: payload.notification.body,
    //             });
    //             console.log('Received foreground message: ', payload);
    //         })
    //         .catch(err => console.error('Failed to receive foreground message: ', err));
    // }, []);


    return (
        <div className='DjHome'>
            {/* {notification.title && (
                <div className='notification'>
                    <h4>{notification.title}</h4>
                    <p>{notification.body}</p>
                </div>
            )} */}
            <div id="notification-root"></div>
            <div className='center-button'>
                <Link to='/djprofile' className='btn-medium left-button'>
                    <button className='toolbar-button'>
                        UPDATE PROFILE
                    </button>
                </Link>
                <Link to='/eventdetails' className='btn-medium'>
                    <button className='toolbar-button'>
                        ADD EVENTS
                    </button>
                </Link>
                <Link to='/showtransactions' className='btn-medium right-button'>
                    <button className='toolbar-button'>
                        SHOW TRANSACTIONS
                    </button>
                </Link>
            </div>

            <DjTabs />
        </div>
    );
}
