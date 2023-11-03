using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging; // Import ILogger
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.QueryRepository;

namespace VibeSyncApp.Middleware
{
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<TokenValidationMiddleware> _logger;

        public TokenValidationMiddleware(RequestDelegate next, IHttpContextAccessor httpContextAccessor, IServiceScopeFactory serviceScopeFactory, ILogger<TokenValidationMiddleware> logger)
        {
            _next = next;
            _httpContextAccessor = httpContextAccessor;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger; // Initialize ILogger
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string authorizationHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authorizationHeader))
            {
                var headerSplitDataArray = authorizationHeader.Split(" ");
                if (!headerSplitDataArray.Any())
                {
                    _logger.LogError("Invalid authorization header: No token found.");
                    throw new UnauthorizedAccessException("You don't have rights to access resource");
                }
                string token = headerSplitDataArray[1];
                var tokenHandler = new JwtSecurityTokenHandler();
                var parsedToken = tokenHandler.ReadJwtToken(token);
                int.TryParse(parsedToken?.Claims?.FirstOrDefault(claim => claim.Type == "UserId")?.Value, out int userId);
                if (userId == 0)
                {
                    _logger.LogError("Invalid or missing UserId claim in token.");
                    throw new UnauthorizedAccessException("You don't have rights to access resource");
                }
                var expiryseconds = long.Parse(parsedToken?.Claims?.FirstOrDefault(claim => claim.Type == "exp")?.Value);
                DateTime expiryTime = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expiryseconds);
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var userQueryRepository = scope.ServiceProvider.GetRequiredService<IUserQueryRepository>();
                    var user = userQueryRepository.GetUserById(userId);
                    if (user == null || user.Token == null || !user.Token.Equals(token) || expiryTime <= DateTime.UtcNow)
                    {
                        _logger.LogError("Invalid token or token has expired for user with ID: {UserId}.", userId);
                        throw new UnauthorizedAccessException("You don't have rights to access resource");
                    }
                }
                _logger.LogInformation("Token validation successful for user with ID: {UserId}.", userId);

                if (_httpContextAccessor.HttpContext.User?.Identities != null && _httpContextAccessor.HttpContext.User.Identities.Any())
                    _httpContextAccessor.HttpContext.User.Identities.FirstOrDefault()?.AddClaims(parsedToken.Claims);
                else
                    _httpContextAccessor.HttpContext.User.AddIdentity(new ClaimsIdentity(parsedToken.Claims));
            }
            await _next(context);
        }
    }
}