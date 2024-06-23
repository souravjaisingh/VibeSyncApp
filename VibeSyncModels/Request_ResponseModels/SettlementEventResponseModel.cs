using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class SettlementEventResponseModel
    {
        public long EventId { get; set; }
        public string EventName { get; set; }
        public string EventDescription { get; set; }
        public DateTime EventStartDatetime { get; set; }
        public DateTime EventEndDatetime { get; set; }
        public int MinimumBid { get; set; }
        public decimal Amount { get; set; }
        public decimal RemainingAmount { get; set; }
        public DateTime DateCreated { get; set; }
    }
    public class SettlementResponseModel
    {
        public IEnumerable<SettlementEventResponseModel> Data { get; set; }
        public int TotalRows { get; set; }
    }
}
