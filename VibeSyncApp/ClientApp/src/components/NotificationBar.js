import React, { useState, useEffect, useRef } from 'react';
import { onMessageListener } from './firebase';
import favi from '../Resources/favicon.png';

const NotificationBar = () => {
    const [message, setMessage] = useState(null);
    const [swiping, setSwiping] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleMessage = async () => {
            const payload = await onMessageListener();
            if (payload.notification) {
                console.log(payload.notification);
                const { title, body } = payload.notification;
                setMessage(`${title}: ${body}`);
                setSwiping(false);

                // Clear the notification after 5 seconds
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
            }
        };

        handleMessage();
    }, []);

    const handleTouchStart = (e) => {
        setSwiping(true);
        notificationRef.current.startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (swiping) {
            const currentX = e.touches[0].clientX;
            const diffX = notificationRef.current.startX - currentX;
            if (diffX > 100) {
                notificationRef.current.style.transform = `translateX(${diffX}px)`;
            }
        }
    };

    const handleTouchEnd = () => {
        if (swiping) {
            const translation = parseFloat(notificationRef.current.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            if (Math.abs(translation) > 100) {
                setMessage(null); // Dismiss the notification
            } else {
                notificationRef.current.style.transform = ''; // Reset position
            }
            setSwiping(false);
        }
    };

    const handleMouseDown = (e) => {
        setSwiping(true);
        notificationRef.current.startX = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (swiping) {
            const currentX = e.clientX;
            const diffX = notificationRef.current.startX - currentX;
            if (diffX > 100) {
                notificationRef.current.style.transform = `translateX(${diffX}px)`;
            }
        }
    };

    const handleMouseUp = () => {
        if (swiping) {
            const translation = parseFloat(notificationRef.current.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            if (Math.abs(translation) > 100) {
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
                    background: 'linear-gradient(to right, rgb(231 207 235), rgb(160 124 181))', // Purple gradient
                    color: 'white',
                    padding: '10px',
                    textAlign: 'center',
                    zIndex: 1000,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    backdropFilter: 'blur(5px)', // Glossy effect
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'transform 0.3s ease-out', // Smooth transition
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
