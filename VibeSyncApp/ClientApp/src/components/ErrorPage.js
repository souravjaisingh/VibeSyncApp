import React, { Component, useContext } from 'react';
import { MyContext } from '../App';
import "./ErrorPage.css";

export default function ErrorPage(props) {
    const { errorMessage } = useContext(MyContext);
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