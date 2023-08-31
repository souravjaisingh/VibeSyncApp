import { GetLiveEvents } from "../components/services/EventsService";

export default async function getLiveEventsHelper(lat, lng) {
    var eventsModel = {
        latitude:lat,
        longitude:lng
    }
    var res = await GetLiveEvents(eventsModel);
    return res;
}