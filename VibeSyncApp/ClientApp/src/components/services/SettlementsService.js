import { handleAPIRequest } from './UserService'; // Adjust the import path as needed

export async function GetSettlementsDataByEvent(eventId) {
    return handleAPIRequest(`Settlements/GetSettlementsDataByEvent?eventId=${eventId}`, 'GET');
}

export async function SettleEventPayments(data) {
    return handleAPIRequest(`Settlements/SettleEventPayment`, 'POST', data);
}
