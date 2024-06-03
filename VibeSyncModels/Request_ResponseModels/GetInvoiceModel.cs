using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetInvoiceModel : IRequest<byte[]>
    {
        public string PaymentId { get; set; }
    }
}
