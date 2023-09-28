using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    /// <summary>
    /// Songs Controller
    /// </summary>
    [Route("[controller]/[action]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private readonly IMediator _mediator;
        /// <summary>
        /// Initializes a new instance of the <see cref="SongsController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public SongsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        /// <summary>
        /// Gets the song.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSong([FromQuery] GetSongRequestModel request)
        {
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        /// <summary>
        /// Gets the song history.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSongHistory([FromQuery] GetSongHistoryRequestModel request)
        {
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSongHistory([FromBody] SongHistoryModel request)
        {
            return Ok(await _mediator.Send(request));
        }
    }
}
