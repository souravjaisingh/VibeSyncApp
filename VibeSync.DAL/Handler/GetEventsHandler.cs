using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// GetEvents Handler
    /// </summary>
    public class GetEventsHandler : IRequestHandler<GetEventsRequest, IEnumerable<EventsResponse>>
    {
        /// <summary>
        /// IEventQueryRepository
        /// </summary>
        private readonly IEventQueryRepository _event;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="eventR"></param>
        public GetEventsHandler(IEventQueryRepository eventR)
        {
            _event = eventR;
        }
        public Task<IEnumerable<EventsResponse>> Handle(GetEventsRequest request, CancellationToken cancellationToken)
        {
            return _event.GetEventsWithDjInfo();
        }
    }
}
