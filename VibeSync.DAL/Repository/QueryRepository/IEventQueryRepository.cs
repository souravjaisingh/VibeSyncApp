using System.Collections.Generic;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IEventQueryRepository
    {
        Task<IEnumerable<EventsResponse>> GetEventsWithDjInfo();
        Task<IEnumerable<EventsResponse>> GetLiveEvents(double latitude, double longitude);
    }
}
