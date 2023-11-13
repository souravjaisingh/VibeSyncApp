import { AddEventByUserId, GetLiveEvents, UpdateEventDetails } from "../components/services/EventsService";

export default async function getLiveEventsHelper(lat, lng) {
    var eventsModel = {
        latitude:lat,
        longitude:lng
    }
    var res = await GetLiveEvents(eventsModel);
    return res;
}

export async function eventDetailsUpsertHelper(userid, eventname, eventdesc, venue, starttime, endtime, lat, lng, minbid, isUpdate, eventid = 0, eventstatus = 'Not live', genre='default'){
    var model = {
        id : eventid,
        userId : userid,
        eventName : eventname,
        eventDescription : eventdesc,
        venue : venue,
        eventStartDateTime : starttime,
        eventEndDateTime : endtime,
        minimumBid : minbid,
        latitude : lat,
        longitude : lng,
        eventGenre : genre,
        eventStatus : eventstatus
    }
    if(isUpdate == true){
        var res = await UpdateEventDetails(model);
        return res;
    }
    var res = await AddEventByUserId(model);
    return res;
}
