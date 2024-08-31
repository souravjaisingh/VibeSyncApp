import React, { Component, useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';
import "./ErrorPage.css";
import Login from './pages/Login';
import UserLogin from '../components/UserLogin'
import Home from './pages/Home';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage(props) {
    const { errorMessage } = useContext(MyContext);
    const navigate = useNavigate();

    const handleRetry = () => {
        // Reset the error state if needed
        if (props.resetErrorBoundary) {
            props.resetErrorBoundary();
        }

        // Clear local storage
        // Step 1: Get the value of the 'fcm' key with a null check
        const fcmValue = localStorage.getItem('fcm') || null;

        // Step 2: Clear the entire localStorage
        localStorage.clear();

        // Step 3: Set the 'fcm' key back to its original value if it exists
        if (fcmValue !== null) {
            localStorage.setItem('fcm', fcmValue);
        }


        // Redirect to the Home component
        navigate('/');
    };
    if (errorMessage === "Invalid Password") {
        const currentUrl = window.location.href;
        if (!currentUrl.includes('/Login')) {
            return <Login />
        } else {
            return <UserLogin />  /* token expired */
        }
    }
    // else if (errorMessage === "500") {
    //     // Clear local storage and redirect immediately
    //     localStorage.clear();
    //     navigate('/');
    //     return null; // Avoid rendering anything else
    // }
    else {
        return (
            <div className={"error-page"}>
                <div className={"oops"}>Oops!</div>
                <div className={"message"}>Something went wrong...</div>
                <div className={"message"}>{errorMessage}</div>
                {props.resetErrorBoundary && (
                    <div>
                        <button className={"retry-button"} onClick={handleRetry}>
                            🔄 Try Again!
                        </button>
                    </div>
                )}
            </div>
        );
    }
}