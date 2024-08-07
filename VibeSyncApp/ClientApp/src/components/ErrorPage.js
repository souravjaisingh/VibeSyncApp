import React, { Component, useContext } from 'react';
import { MyContext } from '../App';
import "./ErrorPage.css";
import Login from './pages/Login';
import UserLogin from '../components/UserLogin'

export default function ErrorPage(props) {
    const { errorMessage } = useContext(MyContext);
    if (errorMessage === "Invalid Password") {
        const currentUrl = window.location.href;
        if (!currentUrl.includes('/Login')) {
            return <Login />
        } else {
            return <UserLogin />  /* token expired */
        }
    }
    else {
        return (
            <div className={"error-page"}>
                <div className={"oops"}>Oops!</div>
                <div className={"message"}>Something went wrong...</div>
                <div className={"message"}>{errorMessage}</div>
                {props.resetErrorBoundary && (
                    <div>
                        <button className={"retry-button"} onClick={props.resetErrorBoundary}>
                            🔄 Try Again!
                        </button>
                    </div>
                )}
            </div>
        );
    }
}