using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetEventsByDjId : IRequest<List<EventsDetails>>
    {
        public long DjId { get; set; }
    }
}
