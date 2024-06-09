using System;

namespace VibeSyncModels.Request_ResponseModels
{
    public class PaymentResponseModel
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
        public long? EventId { get; set; }
        public string EventName { get; set; }
        public string SongName { get; set; }
        public string UserName { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal? Cgst { get; set; }
        public string SongStatus { get; set; }
        public string Contact { get; set; }
    }
}
