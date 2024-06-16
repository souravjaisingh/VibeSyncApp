using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Settlement
    {
        public long Id { get; set; }
        public long EventId { get; set; }
        public decimal Amount { get; set; }
        public decimal RemainingAmount { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public virtual Event Event { get; set; }
    }
}
