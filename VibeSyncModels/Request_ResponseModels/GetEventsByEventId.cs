using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetEventsByEventId : IRequest<EventsDetails>
    {
        public long EventId { get; set; }
        public long UserId { get; set; }
    }
}
