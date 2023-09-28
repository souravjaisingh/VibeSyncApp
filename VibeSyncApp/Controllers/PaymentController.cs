using MediatR;
using Microsoft.AspNetCore.Mvc;
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

        /// <summary>
        /// Gets orderID.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<bool> PersistPaymentData([FromBody] PersistSongHistoryPaymentRequest request)
        {
            return await _mediator.Send(request).ConfigureAwait(false);
        }

        [HttpGet]
        public async Task<IActionResult> GetDjTransactions([FromQuery] GetDjPaymentsRequestModel request)
        {
            return Ok(await _mediator.Send(request));
        }
    }
}
