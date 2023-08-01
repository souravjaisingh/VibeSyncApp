using System;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Payment
    {
        public long Id { get; set; }
        public long SongId { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; }
        public int BidAmount { get; set; }
        public int TotalAmount { get; set; }
        public string Promocode { get; set; }
        public int? Discount { get; set; }
        public string PaymentSource { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }

        public virtual SongHistory Song { get; set; }
    }
}
