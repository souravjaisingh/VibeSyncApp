import * as Constants from '../Constants';
import { useLoadingContext } from '../LoadingProvider';

export async function handleAPIRequest(url, method, data, isFormData = false, isLoginRequest = false) {
    const currentUrl = window.location.href;
    const baseUri = currentUrl.includes('azurewebsites') ? Constants.baseUriAzure : Constants.baseUriVibeSync;


    // Function to refresh the access token
    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem('refreshToken'); // Get refresh token from localStorage

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(baseUri + '/User/Refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
            const { accessToken, refreshToken: newRefreshToken } = await response.json();
            localStorage.setItem('jwt', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            return accessToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    }

    // Function to make the API request
    async function makeRequest(accessToken) {
        const requestOptions = {
            method: method,
            headers: {}
        };

        if (accessToken) {
            requestOptions.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        if (method === 'POST' || method === 'PUT') {
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
            localStorage.removeItem('refreshToken'); // Also remove refresh token on logout
            localStorage.removeItem('expiry');
        }

        try {
            const response = await fetch(baseUri + url, requestOptions);

            // Ensure that we only parse the body once
            const contentType = response.headers.get('content-type');
            let responseData = contentType && contentType.includes('application/json') ? await response.json() : await response.text();

            if (response.status === 401 && !isLoginRequest) { // Check for token expiration or invalid credentials
                if (responseData.message && responseData.message.includes('Username or password is incorrect')) {
                    // If the error message indicates invalid credentials, do not retry
                    handleAPIError(response, url);
                } else {
                    try {
                        const newToken = await refreshAccessToken();
                        // Retry the request with the new token
                        return await makeRequest(newToken);
                    } catch (refreshError) {
                        // If refreshing the token fails, handle the error (e.g., log the user out)
                        console.error('Token refresh failed:', refreshError);
                        throw new Error('Session expired. Please log in again.');
                    }
                }
            }

            if (!response.ok) {
                handleAPIError(response, url);
            }

            if (response.status === 204) {
                return null; // No content
            }

            return responseData;
        } catch (error) {
            console.error('Error in API request:', error);
            throw error;
        }
    }

    // Retrieve the JWT token from localStorage and make the initial request
    const accessToken = localStorage.getItem('jwt');
    return makeRequest(accessToken);
}


    //const requestOptions = {
    //    method: method,
    //    headers: {
    //        //'Content-Type': 'application/json',
    //    }
    //};


//    // Retrieve the JWT token from localStorage
//    const token = localStorage.getItem('jwt');

//    if (token) {
//        requestOptions.headers['Authorization'] = `Bearer ${token}`;
//    }

//    if (method === 'POST' || method === 'PUT') {
//        //requestOptions.body = JSON.stringify(data);
//        if (isFormData) {
//            requestOptions.body = data;
//        } else {
//            requestOptions.headers['Content-Type'] = 'application/json';
//            requestOptions.body = JSON.stringify(data);
//        }
//    }

//    if (data === 'logout') {
//        localStorage.removeItem('userId');
//        localStorage.removeItem('jwt');
//        localStorage.removeItem('refreshToken');
//        localStorage.removeItem('expiry');
//    }

//    try {
//        const response = await fetch(baseUri + url, requestOptions);

//        handleAPIError(response,url);

//        if (response.status === 204) {
//            return null; // No content
//        }

//        // Check the content type of the response
//        const contentType = response.headers.get('content-type');
//        if (contentType && contentType.includes('application/json')) {
//            return await response.json(); // Parse JSON response
//        } else {
//            return await response.text(); // Return text response
//        }
//    } catch (error) {
//        console.error('Error in API request:', error);
//        throw error;
//    }
//}



export default async function RegisterUser(data) {
    const response = await handleAPIRequest('User/RegisterUser', 'POST', data);
    if (response && response.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
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
    const response = await handleAPIRequest('User/LoginUser', 'POST', data, false, true);
    if (response && response.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
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

export async function getUserRequestHistoryData(userid, selectedFilter = null) {
    let url = `Songs/GetSongHistory?userId=${userid}&eventId=${localStorage.getItem('qrEventId')}&isAllRequest=${true}`;
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