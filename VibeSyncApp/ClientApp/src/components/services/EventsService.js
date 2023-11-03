import * as Constants from '../Constants';
import { handleAPIRequest, handleAPIError } from './UserService'; // Import your error handling functions

export async function GetEventsWithDjInfo() {
    return handleAPIRequest('Events/GetAllEvents', 'GET');
}

export async function GetLiveEvents(data) {
    return handleAPIRequest('Events/GetLiveEvents', 'POST', data);
}

export async function GetDjEvents(id) {
    return handleAPIRequest(`Events/GetEventsByUserId?UserId=${id}`, 'GET');
}

export async function AddEventByUserId(data) {
    return handleAPIRequest('Events/CreateEvent', 'POST', data);
}

export async function UpdateEventDetails(data) {
    return handleAPIRequest('Events/UpdateEvent', 'PUT', data);
}
