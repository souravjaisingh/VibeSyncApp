using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("api/webhook")]
    [ApiController]
    public class WebHooksController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PaymentController> _logger; // Inject ILogger

        public WebHooksController(IMediator mediator, ILogger<PaymentController> logger)
        {
            _mediator = mediator;
            _logger = logger; // Initialize ILogger
        }

        [HttpPost]
        [Route("HandleWebhook")]
        public async Task<IActionResult> HandleWebhook([FromBody] RazorpayWebhookPayload payload)
        {
            // Ensure payload is not null and contains the expected payment details
            if (payload?.Payload?.Payment == null)
            {
                return BadRequest("Invalid webhook payload");
            }

            // Extract payment entity from payload
            var paymentEntity = payload.Payload.Payment.Entity;

            // Check if the payment status is 'captured'
            if (paymentEntity?.Status == "captured")
            {
                var response = await _mediator.Send(payload);

                return Ok(response);
            }
            else
            {
                // Ignore webhook events for other payment statuses
                return Ok("Webhook event ignored (not a captured payment)");
            }
        }
    }
}
