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
        IEnumerable<EventsResponse> GetEventsWithDjInfo();
        /// <summary>
        /// Gets the live events.
        /// </summary>
        /// <param name="latitude">The latitude.</param>
        /// <param name="longitude">The longitude.</param>
        /// <returns></returns>
        IEnumerable<EventsResponse> GetLiveEvents(double latitude, double longitude);
    }
}
