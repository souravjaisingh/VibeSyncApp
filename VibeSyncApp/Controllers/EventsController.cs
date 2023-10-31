using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VibeSyncApp.Filters;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    /// <summary>
    /// Events Controller
    /// </summary>
    /// <seealso cref="Microsoft.AspNetCore.Mvc.ControllerBase" />
    [Route("[controller]/[action]")]
    [ApiController]
    public class EventsController : ControllerBase
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
        public EventsController(IMediator mediator, ILogger<EventsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }
        /// <summary>
        /// Gets all events.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IEnumerable<EventsDetails>> GetAllEvents()
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("GetAllEvents")}, Request: {JsonConvert.SerializeObject(new GetEventsRequest())}");

            var res = await _mediator.Send(new GetEventsRequest()).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("GetAllEvents")}'s response: {JsonConvert.SerializeObject(res)}");
            return res;
        }

        [HttpPost]
        public async Task<IEnumerable<EventsDetails>> GetLiveEvents([FromBody] Coordinates coord)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("GetLiveEvents")}, Request: {JsonConvert.SerializeObject(coord)}");

            var res = await _mediator.Send(coord).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("GetLiveEvents")}'s response: {JsonConvert.SerializeObject(res)}");
            return res;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventsDetails request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("CreateEvent")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("CreateEvent")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEvent([FromBody] EventsDetails request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("UpdateEvent")}, Request: {JsonConvert.SerializeObject(request)}");

            await _mediator.Publish(request);

            // Log the response
            _logger.LogInformation($"{typeof(EventsController).GetMethod("UpdateEvent")} executed successfully");
            return Ok(VibeSyncModels.Constants.UpdatedSuccessfully);
        }

        [HttpGet]
        public async Task<IActionResult> GetEventsByUserId([FromQuery] GetEventsByUserId request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("GetEventsByUserId")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("GetEventsByUserId")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> GenerateQRCodeForEvent([FromBody] GenerateQRCodeRequestModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("GenerateQRCodeForEvent")}, Request: {JsonConvert.SerializeObject(request)}");

            byte[] res = await _mediator.Send(request).ConfigureAwait(false);
            string base64Image = Convert.ToBase64String(res);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("GenerateQRCodeForEvent")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(base64Image);
        }
    }
}
