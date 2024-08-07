import { AddEventByUserId, GetLiveEvents, UpdateEventDetails } from "../components/services/EventsService";

export default async function getLiveEventsHelper(lat, lng) {
    var eventsModel = {
        latitude:lat,
        longitude:lng
    }
    var res = await GetLiveEvents(eventsModel);
    return res;
}

export async function eventDetailsUpsertHelper(userid, eventname, eventdesc, venue, starttime, endtime, lat, lng, minbid, isUpdate, minBidForSpecialRequest, acceptingRequests = false, displayRequests = false, hidePlaylist = false, playlists, disableSongSearch = false, eventid = 0, eventstatus = 'Not live', genre = 'default', ){
    var model = {
        id : eventid,
        userId : userid,
        eventName : eventname,
        eventDescription : eventdesc,
        venue : venue,
        eventStartDateTime : starttime,
        eventEndDateTime : endtime,
        minimumBid: minbid,
        minimumBidForSpecialRequest: minBidForSpecialRequest,
        acceptingRequests: acceptingRequests, //for requests
        displayRequests: displayRequests,
        hidePlaylist: hidePlaylist,
        playlists: playlists, // Send the playlist IDs here
        disableSongSearch : disableSongSearch,
        latitude : lat,
        longitude : lng,
        eventGenre : genre,
        eventStatus: eventstatus
       
    }

    if(isUpdate == true){
        var res = await UpdateEventDetails(model);
        return res;
    }
    var res = await AddEventByUserId(model);
    return res;
}
