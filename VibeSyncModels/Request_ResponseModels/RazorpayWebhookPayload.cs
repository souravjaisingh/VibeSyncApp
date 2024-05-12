using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class RazorpayWebhookPayload : IRequest<bool>
    {
        public string Entity { get; set; }
        public string AccountId { get; set; }
        public string Event { get; set; }
        public List<string> Contains { get; set; }
        public RazorpayPayload Payload { get; set; }
        public long CreatedAt { get; set; }
    }

    public class RazorpayPayload
    {
        public RazorpayPayment Payment { get; set; }
    }

    public class RazorpayPayment
    {
        public RazorpayPaymentEntity Entity { get; set; }
    }

    public class RazorpayPaymentEntity
    {
        public string Id { get; set; }
        public string Entity { get; set; }
        public int Amount { get; set; }
        public string Currency { get; set; }
        public int BaseAmount { get; set; }
        public string Status { get; set; }
        public string Order_Id { get; set; }
        public string InvoiceId { get; set; }
        public bool International { get; set; }
        public string Method { get; set; }
        public int AmountRefunded { get; set; }
        public int AmountTransferred { get; set; }
        public string RefundStatus { get; set; }
        public bool Captured { get; set; }
        public string Description { get; set; }
        public string CardId { get; set; }
        public string Bank { get; set; }
        public string Wallet { get; set; }
        public string Vpa { get; set; }
        public string Email { get; set; }
        public string Contact { get; set; }
        public List<object> Notes { get; set; }
        public int Fee { get; set; }
        public int Tax { get; set; }
        public object ErrorCode { get; set; }
        public object ErrorDescription { get; set; }
        public object ErrorSource { get; set; }
        public object ErrorStep { get; set; }
        public object ErrorReason { get; set; }
        public AcquirerData AcquirerData { get; set; }
        public long CreatedAt { get; set; }
        public RazorpayUpi Upi { get; set; }
    }

    public class AcquirerData
    {
        public string Rrn { get; set; }
    }

    public class RazorpayUpi
    {
        public string PayerAccountType { get; set; }
        public string Vpa { get; set; }
        public string Flow { get; set; }
    }

}
