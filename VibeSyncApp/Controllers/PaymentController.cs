using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // Import ILogger
using Newtonsoft.Json;
using Razorpay.Api;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PaymentController> _logger; // Inject ILogger

        public PaymentController(IMediator mediator, ILogger<PaymentController> logger)
        {
            _mediator = mediator;
            _logger = logger; // Initialize ILogger
        }

        [HttpPost]
        public async Task<GetPaymentInitiationDetails> GetPaymentOrderIdUserDetails([FromBody] GetPaymentOrderId request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(PaymentController)}, API: {typeof(PaymentController).GetMethod("GetPaymentOrderIdUserDetails")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(PaymentController).GetMethod("GetPaymentOrderIdUserDetails")}'s response: {JsonConvert.SerializeObject(result)}");

            return result;
        }

        [HttpPost]
        public async Task<bool> PersistPaymentData([FromBody] PersistSongHistoryPaymentRequest request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(PaymentController)}, API: {typeof(PaymentController).GetMethod("PersistPaymentData")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(PaymentController).GetMethod("PersistPaymentData")}'s response: {JsonConvert.SerializeObject(result)}");

            return result;
        }

        [HttpGet]
        public async Task<IActionResult> GetDjTransactions([FromQuery] GetDjPaymentsRequestModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(PaymentController)}, API: {typeof(PaymentController).GetMethod("GetDjTransactions")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(PaymentController).GetMethod("GetDjTransactions")}'s response: {JsonConvert.SerializeObject(result)}");

            return Ok(result);
        }

        [HttpPost]
        public async Task<Refund> InitiateRefund([FromBody] RefundRequest request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(PaymentController)}, API: {typeof(PaymentController).GetMethod("InitiateRefund")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(PaymentController).GetMethod("InitiateRefund")}'s response: {JsonConvert.SerializeObject(result)}");

            return result;
        }


        [HttpGet]
        public async Task<bool> IsPromocodeApplicable([FromQuery] PromocodeApplicableForUserQueryModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(PaymentController)}, API: {typeof(PaymentController).GetMethod("IsPromocodeApplicable")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(PaymentController).GetMethod("IsPromocodeApplicable")}'s response: {JsonConvert.SerializeObject(result)}");

            return result;
        }
    }
}
