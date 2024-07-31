using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VibeSyncApp.Filters;
using VibeSyncModels.Request_ResponseModels;
using Coordinates = VibeSyncModels.Request_ResponseModels.Coordinates;
using VibeSyncModels;
using Microsoft.Extensions.Configuration;

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
        private readonly Cloudinary _cloudinary;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public EventsController(IMediator mediator, ILogger<EventsController> logger, IConfiguration configuration)
        {
            _mediator = mediator;
            _logger = logger;
            var builder = new ConfigurationBuilder().
                SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json");
            Account account = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]

            );
            _cloudinary = new Cloudinary(account);
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
        public async Task<IActionResult> CreateEvent([FromForm] EventsDetails request, IFormFile uploadImg)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("CreateEvent")}, Request: {JsonConvert.SerializeObject(request)}");
            if (uploadImg != null && uploadImg.Length > 0)
                request.DjPhoto = await UploadToCloudinary(uploadImg);

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("CreateEvent")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEvent([FromForm] EventsDetails request, IFormFile uploadImg)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("UpdateEvent")}, Request: {JsonConvert.SerializeObject(request)}");
            if (uploadImg != null && uploadImg.Length > 0)
                request.DjPhoto = await UploadToCloudinary(uploadImg);

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
        [ExcludeTokenAuthentication]
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
        [HttpPost]
        public async Task<IActionResult> GetEventsByEventId([FromBody] GetEventsByEventId request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("GetEventsByEventId")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("GetEventsByEventId")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteEvent([FromQuery] DeleteEvent request)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(EventsController)}, API: {typeof(EventsController).GetMethod("DeleteEvent")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(EventsController).GetMethod("CreateEvent")}'s response: {JsonConvert.SerializeObject(res)}");
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
    }
}
