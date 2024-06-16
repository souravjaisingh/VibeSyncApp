using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Payment
    {
        public long Id { get; set; }
        public long? SongHistoryId { get; set; }
        public string PaymentStatus { get; set; }
        public string PaymentId { get; set; }
        public decimal? BidAmount { get; set; }
        public decimal? TotalAmount { get; set; }
        public string Promocode { get; set; }
        public int? Discount { get; set; }
        public string PaymentSource { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public long? UserId { get; set; }
        public string OrderId { get; set; }
        public string Signature { get; set; }
        public string Contact { get; set; }

        public virtual SongHistory SongHistory { get; set; }
        public virtual User User { get; set; }
    }
}
