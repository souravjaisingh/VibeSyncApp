import { AddEventByUserId, GetLiveEvents } from "../components/services/EventsService";

export default async function getLiveEventsHelper(lat, lng) {
    var eventsModel = {
        latitude:lat,
        longitude:lng
    }
    var res = await GetLiveEvents(eventsModel);
    return res;
}

export async function addEventByUseridHelper(userid, eventname, eventdesc, venue, starttime, endtime, lat, lng, minbid, genre='default', eventstatus = 'Not live'){
    var model = {
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
    var res = await AddEventByUserId(model);
    return res;

}