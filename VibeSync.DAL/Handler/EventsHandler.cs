using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// GetEvents Handler
    /// </summary>
    public class EventsHandler : IRequestHandler<GetEventsRequest, IEnumerable<EventsDetails>>,
        IRequestHandler<EventsDetails, long>, INotificationHandler<EventsDetails>, IRequestHandler<GetEventsByUserId, List<EventsDetails>>
    {
        /// <summary>
        /// IEventQueryRepository
        /// </summary>
        private readonly IEventQueryRepository _eventQueryRepository;
        /// <summary>
        /// The event command repository
        /// </summary>
        private readonly IEventCommandRepository _eventCommandRepository;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="eventR"></param>
        public EventsHandler(IEventQueryRepository eventR, IEventCommandRepository eventCommandRepository)
        {
            _eventQueryRepository = eventR;
            _eventCommandRepository = eventCommandRepository;
        }

        /// <summary>
        /// Handles a request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>
        /// Response from the request
        /// </returns>
        public async Task<IEnumerable<EventsDetails>> Handle(GetEventsRequest request, CancellationToken cancellationToken)
        {
            return await Task.Run(() => _eventQueryRepository.GetEventsWithDjInfo());
        }

        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<long> Handle(EventsDetails request, CancellationToken cancellationToken)
        {
            return await _eventCommandRepository.CreateEvent(request);
        }

        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<EventsDetails>> Handle(GetEventsByUserId request, CancellationToken cancellationToken)
        {
            return await Task.Run(() => _eventQueryRepository.GetEventsByDjId(request));
        }

        /// <summary>
        /// Handles the specified notification.
        /// </summary>
        /// <param name="notification">The notification.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        async Task INotificationHandler<EventsDetails>.Handle(EventsDetails notification, CancellationToken cancellationToken)
        {
            await _eventCommandRepository.UpdateEvent(notification);
        }
    }
}
