using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class Coordinates : IRequest<IEnumerable<EventsResponse>>
    {
        public Coordinates()
        {

        }
        public Coordinates(double lat, double lng)
        {
            Latitude = lat;
            Longitude = lng;
        }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
