import * as Constants from '../Constants'

export async function UpdateDjDetails(data){
    const response = await fetch(Constants.baseUri + 'Dj/UpdateDj', {
        //mode: 'no-cors',
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
return await response.json();
}