using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IEventQueryRepository
    {
        Task<IEnumerable<EventsResponse>> GetEventsWithDjInfo();
    }
}
