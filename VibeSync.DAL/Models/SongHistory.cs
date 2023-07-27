using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSync.DAL.Models
{
    public partial class SongHistory
    {
        public SongHistory()
        {
            Payments = new HashSet<Payment>();
        }

        public long Id { get; set; }
        public long UserId { get; set; }
        public long EventId { get; set; }
        public long DjId { get; set; }
        public string SongName { get; set; }
        public string SongId { get; set; }
        public string SongStatus { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }

        public virtual Dj Dj { get; set; }
        public virtual Event Event { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
    }
}
