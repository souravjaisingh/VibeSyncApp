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

export async function GetDjEvents(id){
    const res = await fetch(Constants.baseUri + 'Events/GetEventsByUserId?UserId=' + id)
    .then(result=>result.json());
    return res;
}

export async function AddEventByUserId(data){
    const response = await fetch(Constants.baseUri + 'Events/CreateEvent', {
        //mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
return await response.json();
}

export async function UpdateEventDetails(data){
    const response = await fetch(Constants.baseUri + 'Events/UpdateEvent', {
        //mode: 'no-cors',
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
return response.text();
}