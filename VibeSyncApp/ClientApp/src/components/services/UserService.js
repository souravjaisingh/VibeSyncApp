import React, { useState, useEffect } from 'react';
import * as Constants from '../Constants'

export default async function RegisterUser(data) {
    const response = await fetch(Constants.baseUri + 'User/RegisterUser', {
                    //mode: 'no-cors',
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    return await response.text();
}
export async function GetUserById(id){
    await fetch(Constants.baseUri + 'User/GetUserById?id=' + id)
    .then(result=> result.json())
    .then(data=> console.log(data));
}

export async function LoginUser(eMail, pass){
    const res = await fetch(Constants.baseUri + 'User/LoginUser?email=' + eMail+ '&password=' +pass)
    .then(result=> result.json());
    return await res;
}