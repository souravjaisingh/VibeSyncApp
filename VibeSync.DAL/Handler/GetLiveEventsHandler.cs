using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// GetLiveEventsHandler
    /// </summary>
    public class GetLiveEventsHandler : IRequestHandler<Coordinates, IEnumerable<EventsResponse>>
    {
        /// <summary>
        /// IEventQueryRepository
        /// </summary>
        private readonly IEventQueryRepository _event;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="eventR"></param>
        public GetLiveEventsHandler(IEventQueryRepository eventR)
        {
            _event = eventR;
        }
        public Task<IEnumerable<EventsResponse>> Handle(Coordinates request, CancellationToken cancellationToken)
        {
            return _event.GetLiveEvents((double)request.Latitude, (double)request.Longitude);
        }
    }
}
