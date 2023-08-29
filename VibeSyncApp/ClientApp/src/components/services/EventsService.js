import * as Constants from '../Constants'

export async function GetEventsWithDjInfo(){
    const res = await fetch(Constants.baseUri + 'Events/GetAllEvents')
    .then(result=>result.json());
    return res;
}

export async function GetLiveEvents(data) {
    const response = await fetch(Constants.baseUri + 'Events/GetLiveEvents', {
                    //mode: 'no-cors',
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    return await response.json();
}