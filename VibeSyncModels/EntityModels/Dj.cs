using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Dj
    {
        public Dj()
        {
            Events = new HashSet<Event>();
            SongHistories = new HashSet<SongHistory>();
            Reviews = new HashSet<Review>();
        }

        public long Id { get; set; }
        public long UserId { get; set; }
        public string DjName { get; set; }
        public string DjGenre { get; set; }
        public string DjDescription { get; set; }
        public string DjPhoto { get; set; }
        public string BankName { get; set; }
        public int? BankAccountNumber { get; set; }
        public string BranchName { get; set; }
        public string Ifsccode { get; set; }
        public string SocialLinks { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string ArtistName { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Event> Events { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<SongHistory> SongHistories { get; set; }
    }
}
