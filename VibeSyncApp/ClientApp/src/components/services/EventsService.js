import * as Constants from '../Constants'

export async function GetEventsWithDjInfo(id){
    const res = await fetch(Constants.baseUri + 'Events/GetAllEvents')
    .then(result=>result.json());
    return res;
}