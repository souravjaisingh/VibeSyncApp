import React, { useState, useEffect, useRef } from 'react';
import { onMessageListener } from './firebase';
import favi from '../Resources/favicon.png';

const NotificationBar = () => {
    const [message, setMessage] = useState(null);
    const [swiping, setSwiping] = useState(false);
    const [startX, setStartX] = useState(null);
    const [startY, setStartY] = useState(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleNotification = async () => {
            while (true) {
                try {
                    const payload = await onMessageListener();
                    if (payload.notification) {
                        const { title, body } = payload.notification;
                        setMessage(`${title}: ${body}`);
                        setSwiping(false);

                        // Clear the notification after 5 seconds
                        setTimeout(() => {
                            setMessage(null);
                        }, 5000);
                    }
                } catch (error) {
                    console.error('Error handling notification: ', error);
                }
            }
        };

        handleNotification();

        // Cleanup function if needed
        return () => {
            // Any cleanup code if necessary
        };
    }, []);

    const handleTouchStart = (e) => {
        setSwiping(true);
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        if (swiping) {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            const translateX = Math.abs(diffX) > 50 ? diffX : 0;
            const translateY = Math.abs(diffY) > 50 ? diffY : 0;

            notificationRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    };

    const handleTouchEnd = () => {
        if (swiping) {
            const transform = notificationRef.current.style.transform;
            const translateX = parseFloat(transform.replace('translate(', '').split(',')[0]) || 0;
            const translateY = parseFloat(transform.split(',')[1]) || 0;

            const shouldDismiss = Math.abs(translateX) > 100 || Math.abs(translateY) > 100;

            if (shouldDismiss) {
                setMessage(null); // Dismiss the notification
            } else {
                notificationRef.current.style.transform = ''; // Reset position
            }

            setSwiping(false);
        }
    };

    const handleMouseDown = (e) => {
        setSwiping(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    const handleMouseMove = (e) => {
        if (swiping) {
            const currentX = e.clientX;
            const currentY = e.clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            const translateX = Math.abs(diffX) > 50 ? diffX : 0;
            const translateY = Math.abs(diffY) > 50 ? diffY : 0;

            notificationRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    };

    const handleMouseUp = () => {
        if (swiping) {
            const transform = notificationRef.current.style.transform;
            const translateX = parseFloat(transform.replace('translate(', '').split(',')[0]) || 0;
            const translateY = parseFloat(transform.split(',')[1]) || 0;

            const shouldDismiss = Math.abs(translateX) > 100 || Math.abs(translateY) > 100;

            if (shouldDismiss) {
                setMessage(null); // Dismiss the notification
            } else {
                notificationRef.current.style.transform = ''; // Reset position
            }

            setSwiping(false);
        }
    };

    return (
        message && localStorage.getItem('userId') != null && (
            <div
                ref={notificationRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    background: 'linear-gradient(to right, rgb(231 207 235), rgb(160 124 181))',
                    color: 'white',
                    padding: '10px',
                    textAlign: 'center',
                    zIndex: 1000,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '25px',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'transform 0.3s ease-out',
                    opacity: '95%'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <img
                    src={favi}
                    alt="Logo"
                    style={{
                        height: '50px',
                        marginRight: '10px'
                    }}
                    loading="lazy"
                />
                <span>{message}</span>
            </div>
        )
    );
};

export default NotificationBar;
