import React, { useState, useEffect } from 'react';

const baseUri = 'https://localhost:44369/';
export default async function registerUser(data){
    var req = {
        "FirstName" : data.given_name,
        "LastName" : data.family_name,
        "Email" : data.email
    }
    const response = await fetch(baseUri + 'User/RegisterUser', {
                        //mode: 'no-cors',
                        method: 'POST',
                        body: JSON.stringify(req),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
    localStorage.setItem("email", data.email);
    const result = await response.json();
    console.log(result);
}
export async function GetUserById(id){
    await fetch(baseUri + 'User/GetUserById?id=' + id)
    .then(result=> result.json())
    .then(data=> console.log(data));
}