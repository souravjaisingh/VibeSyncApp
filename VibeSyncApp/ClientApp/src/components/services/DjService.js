import * as Constants from '../Constants';
import { handleAPIRequest } from './UserService';


export async function UpdateDjDetails(data) {
    return handleAPIRequest('Dj/UpdateDjProfile', 'PUT', data);
}

export async function GetDjProfile(id) {
    return handleAPIRequest(`Dj/GetDjProfile?UserId=${id}`, 'GET');
}

// New function to fetch reviews
export async function GetReviews() {
    return handleAPIRequest('Dj/GetReviews', 'GET');
}