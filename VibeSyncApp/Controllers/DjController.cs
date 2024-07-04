using MediatR;
using Microsoft.AspNetCore.Http;
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
        public async Task<IActionResult> UpdateDjProfile([FromBody] UpdateDjCommandModel request, [FromForm] IFormFile file)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("UpdateDjProfile")}, Request: {JsonConvert.SerializeObject(request)}");
            string fileUrl = null;
            //if (file != null)
            //{
            //    fileUrl = await googleDriveService.UploadFileAndGetUrlAsync(file);
            //    request.DjPhoto = fileUrl;

            //}

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

        [HttpGet]
        public async Task<IActionResult> GetReviews([FromQuery] GetReviewRequestModel request)
        {
            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("GetReviews")}, Request: {JsonConvert.SerializeObject(request)}");

            var result = await _mediator.Send(request);

            _logger.LogInformation($"{ typeof(DjController).GetMethod("GetReviews")}'s response: {JsonConvert.SerializeObject(result)}");
            return Ok(result);
        }


        
    }
}
