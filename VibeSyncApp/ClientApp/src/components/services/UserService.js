import React, { useState, useEffect } from 'react';

const baseUri = 'https://localhost:44369/';
export default async function registerUser(data) {
    const response = await fetch(baseUri + 'User/RegisterUser', {
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
    await fetch(baseUri + 'User/GetUserById?id=' + id)
    .then(result=> result.json())
    .then(data=> console.log(data));
}