import React, { useState, useEffect } from 'react';
import * as Constants from '../Constants'

export default async function RegisterUser(data) {
    try {
        const response = await fetch(Constants.baseUri + 'User/RegisterUser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Handle specific HTTP error status codes
            if (response.status === 400) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.Errors || 'Bad Request');
            } else {
                // Handle other error status codes as needed
                throw new Error('Network response was not ok');
            }
        }

        return await response.text();
    } catch (error) {
        console.error('Error in RegisterUser:', error);
        throw error; // Optionally rethrow the error for further handling.
    }
}
export async function GetUserById(id){
    await fetch(Constants.baseUri + 'User/GetUserById?id=' + id)
    .then(result=> result.json())
    .then(data=> console.log(data));
}

export async function LoginUser(data){
    const response = await fetch(Constants.baseUri + 'User/LoginUser', {
        //mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
return await response.json();
}

export async function getUserRequestHistoryData(userid){
    const res = await fetch(Constants.baseUri + `Songs/GetSongHistory?userId=${userid}`)
    .then((response) => response.json())
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
    return res;
}