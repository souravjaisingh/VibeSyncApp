using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// GetEvents Handler
    /// </summary>
    public class EventsHandler : IRequestHandler<GetEventsRequest, IEnumerable<EventsResponse>>
    {
        /// <summary>
        /// IEventQueryRepository
        /// </summary>
        private readonly IEventQueryRepository _event;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="eventR"></param>
        public EventsHandler(IEventQueryRepository eventR)
        {
            _event = eventR;
        }
        public async Task<IEnumerable<EventsResponse>> Handle(GetEventsRequest request, CancellationToken cancellationToken)
        {
            return await _event.GetEventsWithDjInfo();
        }
    }
}
