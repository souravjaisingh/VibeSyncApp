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
            string jwtCookie = context.Request.Cookies["jwt"];

            if (!string.IsNullOrEmpty(jwtCookie))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var parsedToken = tokenHandler.ReadJwtToken(jwtCookie);
                int.TryParse(parsedToken?.Claims?.FirstOrDefault(claim => claim.Type == "UserId")?.Value, out int userId);

                if (userId == 0)
                {
                    _logger.LogError("Invalid or missing UserId claim in token.");
                    throw new UnauthorizedAccessException("You don't have rights to access the resource");
                }
                var expiryseconds = long.Parse(parsedToken?.Claims?.FirstOrDefault(claim => claim.Type == "exp")?.Value);
                DateTime expiryTime = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expiryseconds);
                if(expiryTime <= DateTime.UtcNow)
                {
                    _httpContextAccessor.HttpContext.Response.Cookies.Delete("jwt");
                    //_logger.LogError("Invalid token or token has expired for user with ID: {UserId}.", userId);
                    //throw new UnauthorizedAccessException("You don't have rights to access the resource");
                }
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var userQueryRepository = scope.ServiceProvider.GetRequiredService<IUserQueryRepository>();
                    var user = userQueryRepository.GetUserById(userId);
                    if (user == null)
                    {
                        _logger.LogError("Invalid token or token has expired for user with ID: {UserId}.", userId);
                        throw new UnauthorizedAccessException("You don't have rights to access the resource");
                    }
                    if(user != null && user.Token != null && !user.Token.Equals(jwtCookie))
                    {
                        _logger.LogError("Invalid token or token has expired for user with ID: {UserId}.", userId);
                        throw new UnauthorizedAccessException("You don't have rights to access the resource");
                    }

                }
                
                _logger.LogInformation("Token validation successful for user with ID: {UserId}.", userId);

                if (_httpContextAccessor.HttpContext.User?.Identities != null && _httpContextAccessor.HttpContext.User.Identities.Any())
                {
                    _httpContextAccessor.HttpContext.User.Identities.FirstOrDefault()?.AddClaims(parsedToken.Claims);
                }
                else
                {
                    _httpContextAccessor.HttpContext.User.AddIdentity(new ClaimsIdentity(parsedToken.Claims));
                }
            }
            await _next(context);
        }
    }
}
