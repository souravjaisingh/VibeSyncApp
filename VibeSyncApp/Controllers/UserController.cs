using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;
using VibeSyncApp.Filters;
using VibeSyncModels.Request_ResponseModels;
using User = VibeSyncModels.Request_ResponseModels.User;

namespace VibeSyncApp.Controllers
{
    /// <summary>
    /// User Controller
    /// </summary>
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<UserController> _logger;

        public UserController(IMediator mediator, ILogger<UserController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet]
        public User GetUserById(int id)
        {
            // Log the request parameter
            _logger.LogInformation($"Entered: {typeof(UserController)}, API: {typeof(UserController).GetMethod("GetUserById")}, Id: {id}");

            // You can add more logging as needed

            return new User();
        }

        [HttpPost]
        [ExcludeTokenAuthentication]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(UserController)}, API: {typeof(UserController).GetMethod("RegisterUser")}, Request: {JsonConvert.SerializeObject(user)}");

            var response = await _mediator.Send(user);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(UserController).GetMethod("RegisterUser")}'s response: {JsonConvert.SerializeObject(response)}");

            return Ok(response);
        }

        [HttpPost]
        [ExcludeTokenAuthentication]
        public async Task<IActionResult> LoginUser([FromBody] LoginUser user)
        {
            // Log the request parameter as JSON
            _logger.LogInformation($"Entered: {typeof(UserController)}, API: {typeof(UserController).GetMethod("LoginUser")}, Request: {JsonConvert.SerializeObject(user)}");

            var result = await _mediator.Send(user);

            // Log the response as JSON
            _logger.LogInformation($"{typeof(UserController).GetMethod("LoginUser")}'s response: {JsonConvert.SerializeObject(result)}");

            if (result.Id != 0)
            {
                return Ok(result);
            }
            else
                return Unauthorized();
        }

        /// <summary>
        /// Logouts the user.
        /// </summary>
        /// <param name="logoutUser">The logout user.</param>
        /// <returns></returns>
        [HttpPost]
        [ExcludeTokenAuthentication]
        public async Task<IActionResult> LogoutUser([FromQuery] LogoutUser logoutUser)
        {
            return Ok(await _mediator.Send(logoutUser));
        }
    }
}
