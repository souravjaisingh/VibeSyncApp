using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetDjPaymentsRequestModel : IRequest<List<PaymentResponseModel>>
    {
        public long EventId { get; set; }
        public long UserId { get; set; }
    }
}
