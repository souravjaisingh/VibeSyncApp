using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class SettleEventPayment : IRequest<bool>
    {
        public long EventId { get; set; }
        public decimal SettlementAmount { get; set; }
    }
}
