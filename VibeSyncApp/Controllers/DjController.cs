using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DjController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<DjController> _logger;

        public DjController(IMediator mediator, ILogger<DjController> logger)
        {
            _mediator = mediator;
            _logger = logger; // Initialize ILogger
        }

        [HttpPut]
        public async Task<IActionResult> UpdateDjProfile([FromBody] UpdateDjCommandModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("UpdateDjProfile")}, Request: {JsonConvert.SerializeObject(request)}");

            await _mediator.Send(request);

            // Log the response
            _logger.LogInformation($"{typeof(DjController).GetMethod("UpdateDjProfile")} executed successfully");

            return Ok(VibeSyncModels.Constants.UpdatedSuccessfully);
        }

        [HttpGet]
        public async Task<IActionResult> GetDjProfile([FromQuery] GetDjProfileRequestModel request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("GetDjProfile")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(DjController).GetMethod("GetDjProfile")}'s response: {JsonConvert.SerializeObject(result)}");

            return Ok(result);
        }
    }
}
