using MediatR;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// PaymentHandler 
    /// </summary>
    public class PaymentHandler : IRequestHandler<GetPaymentOrderId, GetPaymentInitiationDetails>
    {
        private readonly IPaymentQueryRepository _payment;
        public PaymentHandler(IPaymentQueryRepository paymentQueryRepository)
        {
            _payment = paymentQueryRepository;
        }

        /// <summary>
        /// Returns the orderId that is required for initiating a payment
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<GetPaymentInitiationDetails> Handle(GetPaymentOrderId request, CancellationToken cancellationToken)
        {
            return _payment.GetPaymentOrderId(request);
        }
    }
}
