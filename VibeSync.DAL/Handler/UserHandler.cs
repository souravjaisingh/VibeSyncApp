using MediatR;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels;
using VibeSyncModels.Request_ResponseModels;
using Razorpay.Api;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// User Handler
    /// </summary>
    /// <seealso cref="IRequestHandler&lt;User, string&gt;" />
    public class UserHandler : IRequestHandler<User, LoginDetails>,
        IRequestHandler<LoginUser, LoginDetails>,
        IRequestHandler<GetUserId, long>,
        IRequestHandler<LogoutUser, string>
    {
        /// <summary>
        /// The user command repository
        /// </summary>
        private readonly IUserCommandRepository _userCommandRepository;
        /// <summary>
        /// The user query repository
        /// </summary>
        private readonly IUserQueryRepository _userQueryRepository;
        private readonly ILogger<UserHandler> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserHandler"/> class.
        /// </summary>
        /// <param name="userCommandRepository">The user command repository.</param>
        public UserHandler(IUserCommandRepository userCommandRepository, IUserQueryRepository userQueryRepository, ILogger<UserHandler> logger)
        {
            _userQueryRepository = userQueryRepository;
            _userCommandRepository = userCommandRepository;
            _logger = logger;
        }

        /// <summary>
        /// Handles a request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>
        /// Response from the request
        /// </returns>
        public async Task<LoginDetails> Handle(User request, CancellationToken cancellationToken)
        {
            return await _userCommandRepository.CreateUser(request);
        }

        /// <summary>
        /// Handles a request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>
        /// Response from the request
        /// </returns>
        public async Task<LoginDetails> Handle(LoginUser request, CancellationToken cancellationToken)
        {
            var userDetails = _userQueryRepository.ChecksIfUserIsValid(request.Email, request.Password);
            if (!string.IsNullOrWhiteSpace(userDetails.Token))
            {
                var isTokenActive = !IsTokenExpired(userDetails.Token);
                if(isTokenActive)
                    return new LoginDetails { Id = userDetails.Id, IsUser = userDetails.UserOrDj != "dj", Token = userDetails.Token };
            }
            if (userDetails != null && userDetails.Id > 0)
            {
                var token = await _userCommandRepository.GenerateToken(userDetails);
                _logger.LogInformation("Token successful created for user with ID: {UserId}.", userDetails.Id);
                return new LoginDetails { Id = userDetails.Id, IsUser = userDetails.UserOrDj != "dj", Token = token };
            }
            return new LoginDetails();
        }
        private bool IsTokenExpired(string token)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(token);
            var expiration = jwtToken.ValidTo;
            return expiration < DateTime.Now;
        }
        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        /// <exception cref="VibeSyncModels.CustomException">User not found.</exception>
        public Task<long> Handle(GetUserId request, CancellationToken cancellationToken)
        {
            var user = _userQueryRepository.GetUserByEmail(request.email);
            if (user != null)
            {
                return Task.FromResult(user.Id); // Assuming user.Id is of type long
            }
            else
            {
                // Handle the case where the user is not found, for example:
                // return Task.FromResult(-1); // Or any other appropriate default value
                throw new CustomException("User not found.");
            }
        }

        public async Task<string> Handle(LogoutUser request, CancellationToken cancellationToken)
        {
            return await _userCommandRepository.LogoutUser();
        }
    }
}
