using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private readonly IMediator _mediator;

        /// <summary>
        /// Initializes a new instance of the <see cref="PaymentController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public PaymentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Gets orderID.
        /// </summary>
        /// <returns>orderId</returns>
        [HttpPost]
        public async Task<GetPaymentInitiationDetails> GetPaymentOrderIdUserDetails([FromBody] GetPaymentOrderId request)
        {
            return await _mediator.Send(request).ConfigureAwait(false);
        }
    }
}
