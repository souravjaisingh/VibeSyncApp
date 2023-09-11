using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetEventsRequest : IRequest<IEnumerable<EventsDetails>>
    {
    }
}
