using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Review
    {
        public long Id { get; set; }
        public long DjId { get; set; }
        public long EventId { get; set; }
        public string Review1 { get; set; }
        public short? Star { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }

        public virtual Dj Dj { get; set; }
        public virtual Event Event { get; set; }
    }
}
