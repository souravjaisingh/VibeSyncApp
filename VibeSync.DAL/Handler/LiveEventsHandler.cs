using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// GetLiveEventsHandler
    /// </summary>
    public class LiveEventsHandler : IRequestHandler<Coordinates, IEnumerable<EventsDetails>>
    {
        /// <summary>
        /// IEventQueryRepository
        /// </summary>
        private readonly IEventQueryRepository _event;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="eventR"></param>
        public LiveEventsHandler(IEventQueryRepository eventR)
        {
            _event = eventR;
        }
        public async Task<IEnumerable<EventsDetails>> Handle(Coordinates request, CancellationToken cancellationToken)
        {
            return await Task.Run(() => _event.GetLiveEvents(request.Latitude, request.Longitude));
        }
    }
}
