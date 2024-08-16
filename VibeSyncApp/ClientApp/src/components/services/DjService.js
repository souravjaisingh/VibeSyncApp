import * as Constants from '../Constants';
import { handleAPIRequest } from './UserService';


export async function UpdateDjDetails(data) {
    return handleAPIRequest('Dj/UpdateDjProfile', 'PUT', data , true); //added true
}

export async function GetDjProfile(id) {
    return handleAPIRequest(`Dj/GetDjProfile?UserId=${id}`, 'GET');
}

export async function CreateReviews(data) {
    return handleAPIRequest('Dj/CreateReview', 'POST', data);
}