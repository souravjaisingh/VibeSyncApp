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
        public async Task<IEnumerable<EventsResponse>> GetAllEvents()
        {
            return await _mediator.Send(new GetEventsRequest()).ConfigureAwait(false);
        }
        /// <summary>
        /// Gets the live events.
        /// </summary>
        /// <param name="coord">The coord.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IEnumerable<EventsResponse>> GetLiveEvents([FromBody] Coordinates coord)
        {
            return await _mediator.Send(coord).ConfigureAwait(false);
        }
    }
}
