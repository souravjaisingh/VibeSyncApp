using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DjController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private readonly IMediator _mediator;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public DjController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Updates the dj.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> UpdateDjProfile([FromBody] UpdateDjCommandModel request)
        {
            await _mediator.Send(request);
            return Ok(VibeSyncModels.Constants.UpdatedSuccessfully);
        }

        [HttpGet]
        public async Task<IActionResult> GetDjProfile([FromQuery] GetDjProfileRequestModel request)
        {
            return Ok(await _mediator.Send(request));
        }

    }
}
