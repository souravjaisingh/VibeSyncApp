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
        public string account_id { get; set; }
        public List<string> contains { get; set; }
        public long created_at { get; set; }
        public string entity { get; set; }
        public string @event { get; set; } // Use @event to map to 'event' property
        public RazorpayPayload payload { get; set; }
    }

    public class RazorpayPayload
    {
        public RazorpayPayment payment { get; set; }
    }

    public class RazorpayPayment
    {
        public RazorpayPaymentEntity entity { get; set; }
    }

    public class RazorpayPaymentEntity
    {
        public RazorpayAcquirerData acquirer_data { get; set; }
        public int amount { get; set; }
        public int amount_refunded { get; set; }
        public int amount_transferred { get; set; }
        public object bank { get; set; }
        public int base_amount { get; set; }
        public bool captured { get; set; }
        public object card_id { get; set; }
        public string contact { get; set; }
        public long created_at { get; set; }
        public string currency { get; set; }
        public string description { get; set; }
        public string email { get; set; }
        public string entity { get; set; }
        public object error_code { get; set; }
        public object error_description { get; set; }
        public object error_reason { get; set; }
        public object error_source { get; set; }
        public object error_step { get; set; }
        public int fee { get; set; }
        public string id { get; set; }
        public bool international { get; set; }
        public object invoice_id { get; set; }
        public string method { get; set; }
        public Dictionary<string, string> notes { get; set; }
        public string order_id { get; set; }
        public object provider { get; set; }
        public object refund_status { get; set; }
        public object reward { get; set; }
        public string status { get; set; }
        public int tax { get; set; }
        public RazorpayUpi upi { get; set; }
        public string vpa { get; set; }
        public object wallet { get; set; }
    }

    public class RazorpayAcquirerData
    {
        public string rrn { get; set; }
        public string upi_transaction_id { get; set; }
    }

    public class RazorpayUpi
    {
        public string payer_account_type { get; set; }
        public string vpa { get; set; }
    }


}
