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

export async function DeleteEventByEventId(data) {
    return handleAPIRequest(`Events/DeleteEvent?eventId=${data}`, 'POST', data);
}

export async function UpdateEventDetails(data) {
    return handleAPIRequest('Events/UpdateEvent', 'PUT', data);
}

export async function GenerateQRCode(){
    const data={
        Url:'https://your-qr-code-url-here'
    }
    return handleAPIRequest('Events/GenerateQRCodeForEvent', 'POST', data);
}

export async function GetEventByEventId(eventId, userId){
    const data={
        eventId: eventId,
        userId: userId
    }
    return handleAPIRequest('Events/GetEventsByEventId', 'POST', data);
}