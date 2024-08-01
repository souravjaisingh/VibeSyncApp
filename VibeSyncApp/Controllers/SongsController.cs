using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        /// Logger
        /// </summary>
        private readonly ILogger<SongsController> _logger;
        /// <summary>
        /// Initializes a new instance of the <see cref="SongsController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public SongsController(IMediator mediator, ILogger<SongsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }
        /// <summary>
        /// Gets the song.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSong([FromQuery] GetSongRequestModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(SongsController)}, API: {typeof(SongsController).GetMethod("GetSong")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(SongsController).GetMethod("GetSong")}'s response: {JsonConvert.SerializeObject(result)}");
            if (result.Count == 0)
                return NoContent();
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
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(SongsController)}, API: {typeof(SongsController).GetMethod("GetSongHistory")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(SongsController).GetMethod("GetSongHistory")}'s response: {JsonConvert.SerializeObject(result)}");

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSongHistory([FromBody] SongHistoryModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(SongsController)}, API: {typeof(SongsController).GetMethod("UpdateSongHistory")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(SongsController).GetMethod("UpdateSongHistory")}'s response: {JsonConvert.SerializeObject(result)}");

            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetPlaylistList()
        {
            var result = await _mediator.Send(new GetPlaylistList());
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPlaylistTracks([FromQuery] GetPlaylistTracks request)
        {
            var result = await _mediator.Send(request);
            return Ok(result);
        }
    }
}
