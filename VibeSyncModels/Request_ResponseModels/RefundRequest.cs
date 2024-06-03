using MediatR;
using Razorpay.Api;

namespace VibeSyncModels.Request_ResponseModels
{
    public class RefundRequest : IRequest<Refund>
    {
        public string PaymentId { get; set; }
        public decimal Amount { get; set; }
        public long UserId { get; set; }
    }
}
