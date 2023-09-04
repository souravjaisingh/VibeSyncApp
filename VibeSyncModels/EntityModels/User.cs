using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class User
    {
        public User()
        {
            Djs = new HashSet<Dj>();
            Logs = new HashSet<Log>();
            SongHistories = new HashSet<SongHistory>();
        }

        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsSsologin { get; set; }
        public string UserOrDj { get; set; }

        public virtual ICollection<Dj> Djs { get; set; }
        public virtual ICollection<Log> Logs { get; set; }
        public virtual ICollection<SongHistory> SongHistories { get; set; }
    }
}
