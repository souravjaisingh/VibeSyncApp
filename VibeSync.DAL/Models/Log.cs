using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSync.DAL.Models
{
    public partial class Log
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public long? DjId { get; set; }
        public long? EventId { get; set; }
        public string LogName { get; set; }
        public string LogDescription { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }

        public virtual Dj Dj { get; set; }
        public virtual Event Event { get; set; }
        public virtual User User { get; set; }
    }
}
