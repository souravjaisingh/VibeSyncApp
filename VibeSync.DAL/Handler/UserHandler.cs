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
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// User Handler
    /// </summary>
    /// <seealso cref="IRequestHandler&lt;User, string&gt;" />
    public class UserHandler : IRequestHandler<User, LoginDetails>,
        IRequestHandler<LoginUser, LoginDetails>,
        IRequestHandler<GetUserId, long>,
        IRequestHandler<LogoutUser, string>,
        IRequestHandler<LoginDetails, LoginDetails>
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

            if (userDetails != null)
            {
                // Fetch DjId from Dj table if userDetails is not null
                var djId = userDetails.UserOrDj == "dj" ? _userQueryRepository.GetDjByUserId(userDetails.Id) : 0;

                // Check if the token is active
                if (!string.IsNullOrWhiteSpace(userDetails.Token))
                {
                    var isTokenActive = !IsTokenExpired(userDetails.Token);
                    if (isTokenActive)
                        return new LoginDetails
                        {
                            Id = userDetails.Id,
                            IsUser = userDetails.UserOrDj != "dj",
                            Token = userDetails.Token,
                            DjId = djId > 0 ? djId : null // Include the DjId if applicable
                        };
                }

                if (userDetails.Id > 0)
                {
                    var token = await _userCommandRepository.GenerateToken(userDetails);
                    _logger.LogInformation("Token successful created for user with ID: {UserId}.", userDetails.Id);

                    return new LoginDetails
                    {
                        Id = userDetails.Id,
                        IsUser = userDetails.UserOrDj != "dj",
                        Token = token.Token,
                        RefreshToken = token.RefreshToken,
                        DjId = djId > 0 ? djId : null  // Include the DjId if applicable
                    };
                }
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

        public async Task<LoginDetails> Handle(LoginDetails request, CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromExpiredToken(request.Token);
            request.Id = Convert.ToInt64(userId);
            var token = await _userCommandRepository.GenerateTokenByRefreshToken(request);
            
            return new LoginDetails { Id = request.Id, IsUser = token.UserOrDj != "dj", Token = token.Token, RefreshToken = token.RefreshToken };
        }
        private string GetUserIdFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "UserId");
            return userIdClaim?.Value;
        }
    }
}
