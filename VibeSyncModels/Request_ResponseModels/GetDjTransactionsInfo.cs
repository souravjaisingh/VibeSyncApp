using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetDjTransactionsInfoRequest : IRequest<GetDjTransactionsSummary>
    {
        public long? DjId { get; set; }
    }
}
