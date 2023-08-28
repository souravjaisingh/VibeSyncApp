using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class Coordinates : IRequest<IEnumerable<EventsResponse>>
    {
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
