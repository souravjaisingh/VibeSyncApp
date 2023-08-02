using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Event
    {
        public Event()
        {
            Logs = new HashSet<Log>();
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

        public virtual Dj Dj { get; set; }
        public virtual ICollection<Log> Logs { get; set; }
        public virtual ICollection<SongHistory> SongHistories { get; set; }
    }
}
