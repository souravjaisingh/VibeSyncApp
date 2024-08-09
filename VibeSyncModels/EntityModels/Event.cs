using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Event
    {
        public Event()
        {
            Reviews = new HashSet<Review>();
            Settlements = new HashSet<Settlement>();
            SongHistories = new HashSet<SongHistory>();
        }

        public long Id { get; set; }
        public string EventName { get; set; }
        public long DjId { get; set; }
        public string Venue { get; set; }
        public string EventStatus { get; set; }
        public string EventDescription { get; set; }
        public string EventGenre { get; set; }
        public DateTime EventStartDateTime { get; set; }
        public DateTime EventEndDateTime { get; set; }
        public int MinimumBid { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool AcceptingRequests { get; set; }
        public bool DisplayRequests { get; set; }
        public bool HidePlaylist { get; set; }
        public int? MinimumBidForSpecialRequest { get; set; }
        public string Playlists { get; set; }
        public bool? DisableSongSearch { get; set; }

        public virtual Dj Dj { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Settlement> Settlements { get; set; }
        public virtual ICollection<SongHistory> SongHistories { get; set; }
    }
}
