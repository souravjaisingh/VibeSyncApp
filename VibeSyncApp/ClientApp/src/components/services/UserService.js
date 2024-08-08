import * as Constants from '../Constants';
import { useLoadingContext } from '../LoadingProvider';

export async function handleAPIRequest(url, method, data, isFormData = false) {
    const currentUrl = window.location.href;
    const baseUri = currentUrl.includes('azurewebsites') ? Constants.baseUriAzure : Constants.baseUriVibeSync;

    const requestOptions = {
        method: method,
        headers: {
            //'Content-Type': 'application/json',
        }
    };

    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwt');

    if (token) {
        requestOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    if (method === 'POST' || method === 'PUT') {
        //requestOptions.body = JSON.stringify(data);
        if (isFormData) {
            requestOptions.body = data;
        } else {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(data);
        }
    }

    if (data === 'logout') {
        localStorage.removeItem('userId');
        localStorage.removeItem('jwt');
        localStorage.removeItem('expiry');
    }

    try {
        const response = await fetch(baseUri + url, requestOptions);

        handleAPIError(response,url);

        if (response.status === 204) {
            return null; // No content
        }

        // Check the content type of the response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json(); // Parse JSON response
        } else {
            return await response.text(); // Return text response
        }
    } catch (error) {
        console.error('Error in API request:', error);
        throw error;
    }
}



export default async function RegisterUser(data) {
    const response = await handleAPIRequest('User/RegisterUser', 'POST', data);
    if (response && response.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('jwt', response.token);
        setLocalstorageExpiry();
    }
    return response;
}


export async function Logout() {
    return handleAPIRequest('User/LogoutUser', 'POST', 'logout');
}


export async function GetUserById(id) {
    return handleAPIRequest(`User/GetUserById?id=${id}`, 'GET');
}

export async function LoginUser(data) {
    const response = await handleAPIRequest('User/LoginUser', 'POST', data);
    if (response && response.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('jwt', response.token);
        setLocalstorageExpiry();
    }
    return response;
}

export async function setLocalstorageExpiry() {
    const currentDatetime = new Date();
    // Add 1 hour to the current datetime
    const newDatetime = new Date(currentDatetime.getTime() + 60 * 60 * 1000);

    // Convert the new datetime to a string (or any format you prefer)
    //const formattedDatetime = newDatetime.toISOString();

    // Set the formatted datetime in the localStorage
    localStorage.setItem('expiry', newDatetime);
}

export async function getUserRequestHistoryData(userid, selectedFilter = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let url = `Songs/GetSongHistory?userId=${userid}&eventId=${localStorage.getItem('qrEventId')}&isAllRequest=${true}&offset=${offset}&limit=${limit}`;
    if (selectedFilter !== null) {
        url += `&songStatus=${selectedFilter}`;
    }
    return handleAPIRequest(url, 'GET');
}

export function handleAPIError(response,url) {
    if (!response.ok) {
        switch (response.status) {
            case 400:
                if(url.includes('Login')){
                    return response
                }
                else{
                    throw new Error("Houston, we have a problem. Your request is as clear as mud. Enter correct data and we shall let you pass.");
                }
                
            case 403:
                throw new Error("Access denied. You've stumbled into the secret garden. Unfortunately, you're not on the guest list.");
            case 404:
                throw new Error("Oops! This page is as lost as you are on a Monday morning.");
            case 500:
                throw new Error("Looks like we've hit a snag. Our engineers are on it faster than you can say 'bug'.");
            case 503:
                throw new Error("Hold on tight! Our team of highly trained monkeys is fixing the issue.");
            case 401:
                    if(url.includes('Login')){
                        return response
                    }
                    else{
                        throw new Error("Invalid Password");
                    }
            case 409:
                throw new Error("Double trouble! That email's already taken. Please choose a unique one. If you still think it's unique, probably our server has gone crazy.");
            default:
                throw new Error("Our server is on a coffee break. It'll be back after it finishes its latte.");
        }
    }
}