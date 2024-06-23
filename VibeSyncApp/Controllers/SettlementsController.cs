using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SettlementsController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private readonly IMediator _mediator;
        /// <summary>
        /// Logger
        /// </summary>
        private readonly ILogger<EventsController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public SettlementsController(IMediator mediator, ILogger<EventsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Gets settlements data for an event
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSettlementsDataByEvent")]
        public async Task<SettlementResponse> GetSettlementsDataByEvent([FromQuery] GetSettlementsDataByEventId request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(SettlementsController)}, API: {typeof(EventsController).GetMethod("GetSettlementsDataByEvent")}, Request: {JsonConvert.SerializeObject(new GetSettlementsDataByEventId())}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(SettlementsController).GetMethod("GetSettlementsDataByEventId")}'s response: {JsonConvert.SerializeObject(res)}");
            return res;
        }

        /// <summary>
        /// Settles payment
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("SettleEventPayment")]
        public async Task<bool> SettleEventPayment([FromBody] SettleEventPayment request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(SettlementsController)}, API: {typeof(EventsController).GetMethod("SettleEventPayment")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(SettlementsController).GetMethod("SettleEventPayment")}'s response: {JsonConvert.SerializeObject(res)}");
            return res;
        }
        /// <summary>
        /// GetSettlementsByUser
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetSettlementsByUser")]
        public async Task<SettlementResponseModel> GetSettlementsByUser([FromBody] SettlementRequestModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(SettlementsController)}, API: {typeof(EventsController).GetMethod("GetSettlementsByUser")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(SettlementsController).GetMethod("GetSettlementsByUser")}'s response: {JsonConvert.SerializeObject(res)}");
            return res;
        }
    }
}
