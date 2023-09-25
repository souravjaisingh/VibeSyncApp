import * as Constants from '../Constants'

export async function UpdateDjDetails(data){
    const response = await fetch(Constants.baseUri + 'Dj/UpdateDjProfile', {
        //mode: 'no-cors',
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
return await response.text();
}

export async function GetDjProfile(id){
    const res = await fetch(Constants.baseUri + 'Dj/GetDjProfile?UserId=' + id)
    .then(result=>result.json());
    return res;
}