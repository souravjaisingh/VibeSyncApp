using MediatR;
using System;

namespace VibeSyncModels.Request_ResponseModels
{
    public class EventsDetails : IRequest<long>, INotification
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string EventName { get; set; }
        public long? DjId { get; set; }
        public string DjName { get; set; }
        public string DjGenre { get; set; }
        public string DjDescription { get; set; }
        public string DjPhoto { get; set; }
        public string Venue { get; set; }
        public string EventStatus { get; set; }
        public string EventDescription { get; set; }
        public string EventGenre { get; set; }
        public DateTime EventStartDateTime { get; set; }
        public DateTime EventEndDateTime { get; set; }
        public int MinimumBid { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? DistanceFromCurrLoc { get; set; }
        public bool AcceptingRequests { get; set; }
        public bool DisplayRequests { get; set; }
        public bool HidePlaylist { get; set; }
        public string Playlists { get; set; }

    }
}
