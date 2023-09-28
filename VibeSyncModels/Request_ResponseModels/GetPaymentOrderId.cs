using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetPaymentOrderId : IRequest<GetPaymentInitiationDetails>
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
    }
}
