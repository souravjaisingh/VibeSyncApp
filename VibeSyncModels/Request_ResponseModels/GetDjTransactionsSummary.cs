namespace VibeSyncModels.Request_ResponseModels
{
    public class GetDjTransactionsSummary
    {
        public decimal? TotalAmount { get; set; }
        public decimal? SettledAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
        public int? TotalRequests { get; set; }
        public int? TotalPlayedRequests { get; set; }
        public int? TotalRefundedRequests { get; set; }
    }
}