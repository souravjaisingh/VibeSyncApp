using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;
using User = VibeSyncModels.Request_ResponseModels.User;

namespace VibeSyncApp.Controllers
{
    /// <summary>
    /// User Controller
    /// </summary>
    /// <seealso cref="Microsoft.AspNetCore.Mvc.ControllerBase" />
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private readonly IMediator _mediator;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="mediator">The mediator.</param>
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }
        /// <summary>
        /// Gets the user by identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        public User GetUserById(int id)
        {
            return new User();
        }

        /// <summary>
        /// Registers the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            var response = await _mediator.Send(user);
            if(response > 0)
            {
                var userId = await _mediator.Send(new GetUserId { email = user.Email });
                return Ok(userId);
            }
            return Ok(response);
        }

        /// <summary>
        /// checks if user is valid.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> LoginUser([FromBody] LoginUser user)
        {
            var result = await _mediator.Send(user);
            if (result)
                return Ok(result);
            else
                return Unauthorized();
        }
    }
}
