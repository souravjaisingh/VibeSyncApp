using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;
using CloudinaryDotNet;
using Microsoft.Extensions.Configuration;
using CloudinaryDotNet.Actions;
using VibeSyncModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DjController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<DjController> _logger;
        private readonly Cloudinary _cloudinary;

        public DjController(IMediator mediator, ILogger<DjController> logger, IConfiguration configuration)
        {
            _mediator = mediator;
            _logger = logger; // Initialize ILogger
            Account account = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]

            );
            _cloudinary = new Cloudinary(account);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateDjProfile([FromForm] UpdateDjCommandModel request, IFormFile uploadImg)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("UpdateDjProfile")}, Request: {JsonConvert.SerializeObject(request)}");
            if (uploadImg != null && uploadImg.Length > 0)
                request.DjPhoto = await UploadToCloudinary(uploadImg);
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

            _logger.LogInformation($"{typeof(DjController).GetMethod("GetReviews")}'s response: {JsonConvert.SerializeObject(result)}");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewDetails request)
        {
            
            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("CreateReview")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            _logger.LogInformation($"{typeof(DjController).GetMethod("CreateReview")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }
        private async Task<string> UploadToCloudinary(IFormFile file)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, file.OpenReadStream())
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams).ConfigureAwait(false);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                return uploadResult.SecureUrl.ToString();
            else
                throw new CustomException(uploadResult.Error.Message);
        }

        [HttpGet]
        public async Task<IActionResult> DjTransactionsInfo([FromQuery] GetDjTransactionsInfoRequest request)
        {

            _logger.LogInformation($"Entered: {typeof(DjController)}, API: {typeof(DjController).GetMethod("DjTransactionsInfo")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            _logger.LogInformation($"{typeof(DjController).GetMethod("DjTransactionsInfo")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }
    }
}
