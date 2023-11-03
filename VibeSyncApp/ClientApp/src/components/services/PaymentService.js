import * as Constants from '../Constants';
import { handleAPIRequest } from './UserService';

// Other functions you provided

export async function GetPaymentInitiationDetails(data) {
    return handleAPIRequest('Payment/GetPaymentOrderIdUserDetails', 'POST', data);
}

export async function UpsertPayment(data) {
    return handleAPIRequest('Payment/PersistPaymentData', 'POST', data);
}

export async function GetTransactionHistory(id) {
    return handleAPIRequest(`Payment/GetDjTransactions?UserId=${id}`, 'GET');
}
