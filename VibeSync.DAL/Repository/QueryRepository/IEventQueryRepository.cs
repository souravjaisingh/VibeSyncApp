using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.Helpers;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IEventQueryRepository
    {
        Task<IEnumerable<EventsResponse>> GetEventsWithDjInfo();
        Task<IEnumerable<EventsResponse>> GetLiveEvents(double latitude, double longitude);
    }
}
