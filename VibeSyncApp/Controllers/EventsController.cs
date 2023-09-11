using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public EventsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        /// <summary>
        /// Gets all events.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IEnumerable<EventsDetails>> GetAllEvents()
        {
            return await _mediator.Send(new GetEventsRequest()).ConfigureAwait(false);
        }
        /// <summary>
        /// Gets the live events.
        /// </summary>
        /// <param name="coord">The coord.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IEnumerable<EventsDetails>> GetLiveEvents([FromBody] Coordinates coord)
        {
            return await _mediator.Send(coord).ConfigureAwait(false);
        }

        /// <summary>
        /// Creates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventsDetails request)
        {
            return Ok(await _mediator.Send(request));
        }

        /// <summary>
        /// Updates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> UpdateEvent([FromBody] EventsDetails request)
        {
            await _mediator.Publish(request);
            return Ok(VibeSyncModels.Constants.UpdatedSuccessfully);
        }

        /// <summary>
        /// Gets the events by dj identifier.
        /// </summary>
        /// <param name="djId">The dj identifier.</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetEventsByDjId([FromQuery]GetEventsByDjId request)
        {
            return Ok(await _mediator.Send(request));
        }
    }
}
