import * as Constants from '../Constants'

export async function GetPaymentInitiationDetails(data){
    const response = await fetch(Constants.baseUri + 'Payment/GetPaymentOrderIdUserDetails', {
        //mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

export async function UpsertPayment(data){
    const response = await fetch(Constants.baseUri + 'Payment/PersistPaymentData', {
        //mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}