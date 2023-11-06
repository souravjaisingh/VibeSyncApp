using System.Collections.Generic;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// IEvent Query Repository
    /// </summary>
    public interface IEventQueryRepository
    {
        /// <summary>
        /// Gets the events with dj information.
        /// </summary>
        /// <returns></returns>
        IEnumerable<EventsDetails> GetEventsWithDjInfo();
        /// <summary>
        /// Gets the live events.
        /// </summary>
        /// <param name="latitude">The latitude.</param>
        /// <param name="longitude">The longitude.</param>
        /// <returns></returns>
        IEnumerable<EventsDetails> GetLiveEvents(double latitude, double longitude);
        /// <summary>
        /// Gets the events by dj identifier.
        /// </summary>
        /// <returns></returns>
        List<EventsDetails> GetEventsByDjId(GetEventsByUserId request);
        /// <summary>
        /// Gets the events by event identifier.
        /// </summary>
        /// <returns></returns>
        EventsDetails GetEventsByEventId(GetEventsByEventId request);
    }
}
