using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetEventsByUserId : IRequest<List<EventsDetails>>
    {
        public long UserId { get; set; }
    }
}
