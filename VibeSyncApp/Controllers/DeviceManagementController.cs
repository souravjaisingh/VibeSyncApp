using CloudinaryDotNet;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncApp.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DeviceManagementController: ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<DeviceManagementController> _logger;
        public DeviceManagementController(IMediator mediator, ILogger<DeviceManagementController> logger, IConfiguration configuration)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> InsertDeviceForNotification([FromBody] DeviceManagement request)
        {

            _logger.LogInformation($"Entered: {typeof(DeviceManagementController)}, API: {typeof(DeviceManagementController).GetMethod("InsertDeviceForNotification")}, Request: {JsonConvert.SerializeObject(request)}");

            var res = await _mediator.Send(request).ConfigureAwait(false);

            _logger.LogInformation($"{typeof(DjController).GetMethod("InsertDeviceForNotification")}'s response: {JsonConvert.SerializeObject(res)}");
            return Ok(res);
        }
    }
}
