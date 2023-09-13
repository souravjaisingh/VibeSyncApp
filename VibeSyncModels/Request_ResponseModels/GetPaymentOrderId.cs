using MediatR;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetPaymentOrderId : IRequest<GetPaymentInitiationDetails>
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
    }
}
