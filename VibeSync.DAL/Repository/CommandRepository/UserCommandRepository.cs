﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;
using UserRequestModel = VibeSyncModels.Request_ResponseModels.UserRequestModel;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// User Command Repository
    /// </summary>
    /// <seealso cref="VibeSync.DAL.Repository.CommandRepository.IUserCommandRepository" />
    public class UserCommandRepository : IUserCommandRepository
    {

        /// <summary>
        /// The HTTP context accessor
        /// </summary>
        private readonly IHttpContextAccessor _httpContextAccessor;
        /// <summary>
        /// The configuration
        /// </summary>
        private readonly IConfiguration _configuration;
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;
        private readonly ILogger<UserCommandRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public UserCommandRepository(IDBContextFactory context, IMapper mapper, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, ILogger<UserCommandRepository> logger)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        /// <summary>
        /// Creates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        public async Task<LoginDetails> CreateUser(UserRequestModel user)
        {
            VibeSyncModels.EntityModels.User getUser = null;

            // Check if login is with Mobile OTP
            if (user.Email.EndsWith("@otp.com"))
            {
                // Find the user by phone number
                getUser = _context.Users.FirstOrDefault(x => x.PhoneNumber == user.PhoneNumber);

                if (getUser != null)
                {
                    // Handle as SSO login if user found by phone number
                    var loginresponse = _mapper.Map<LoginDetails>(getUser);
                    var token = await GenerateToken(getUser);
                    loginresponse.Token = token.Token;
                    loginresponse.RefreshToken = token.RefreshToken;
                    return loginresponse;
                }
            }
            else
            {
                // Find the user by email for regular login or SSO login
                getUser = _context.Users.FirstOrDefault(x => x.Email == user.Email);
            }

            // Handle case when user is not found or SSO login
            if (getUser != null && !user.IsSsologin)
            {
                throw new CustomException(Constants.UserAlreadyExists);
            }
            else if (user.IsSsologin && getUser != null)
            {
                var loginresponse = _mapper.Map<LoginDetails>(getUser);
                var token = await GenerateToken(getUser);
                loginresponse.Token = token.Token;
                loginresponse.RefreshToken = token.RefreshToken;
                return loginresponse;
            }
            else
            {
                // Register the user if not found
                user.CreatedOn = DateTime.Now;
                user.CreatedBy = user.Email;
                user.IsActive = true;
                user.Gender = user.Gender != null ? char.ToUpper(user.Gender[0]).ToString() : null;
                user.Password = user.IsSsologin ? Guid.NewGuid().ToString() : user.Password;

                var userEntity = _mapper.Map<VibeSyncModels.EntityModels.User>(user);
                _context.Users.Add(userEntity);
                var response = await _context.SaveChangesAsync();
                long djId = 0;
                if (response > 0 && user.UserOrDj.Equals("dj", StringComparison.CurrentCultureIgnoreCase))
                {
                    // Create an entry in the DJ table
                    var djEntity = new Dj
                    {
                        UserId = userEntity.Id,
                        CreatedBy = userEntity.CreatedBy,
                        CreatedOn = userEntity.CreatedOn,
                        DjName = userEntity.FirstName + " " + userEntity.LastName,
                    };
                    _context.Djs.Add(djEntity);
                    await _context.SaveChangesAsync();

                    // Retrieve the Id of the newly inserted DJ record
                    djId = djEntity.Id;
                }
               
                if (response > 0)
                {
                    var loginresponse = _mapper.Map<LoginDetails>(userEntity);
                    loginresponse.DjId = djId == 0 ? null : djId;
                    var token = await GenerateToken(userEntity);
                    loginresponse.Token = token.Token;
                    loginresponse.RefreshToken = token.RefreshToken;
                    return loginresponse;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
        }

        /// <summary>
        /// Deletes the user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        public async Task<int> DeleteUser(int userId)
        {
            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
            user.IsActive = false;
            return await _context.SaveChangesAsync();
        }

        public async Task<(string Token, string RefreshToken)> GenerateToken(VibeSyncModels.EntityModels.User userDetails)
        {
            var claims = new[]
            {
                new Claim("UserId", userDetails.Id.ToString()),
                new Claim(ClaimTypes.Email, userDetails.Email),
                new Claim(ClaimTypes.Name, string.Concat(userDetails.FirstName," ", userDetails.LastName)),
                new Claim(ClaimTypes.Role, userDetails.UserOrDj),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            // Create signing credentials
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create a JWT token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(8),
                SigningCredentials = creds
            };

            // Serialize the token to a string
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            userDetails.Token = tokenHandler.WriteToken(token);

            // Generate Refresh Token
            var refreshToken = GenerateRefreshToken();
            userDetails.RefreshToken = refreshToken;
            userDetails.RefreshTokenExpiryDate = DateTime.Now.AddHours(16);

            _context.Users.Update(userDetails);
            await _context.SaveChangesAsync();
            return (userDetails.Token, userDetails.RefreshToken);
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
        public async Task<string> LogoutUser()
        {
            var userId = loggedInUserId();
            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
            if (user != null)
            {
                user.Token = null;
                await _context.SaveChangesAsync();
                _logger.LogInformation("Logout successfull for user with ID: {UserId}.", user.Id);
                return Constants.Logout_Successfull;
            }
            throw new CustomException(Constants.UserNotFound);
        }

        private int loggedInUserId()
        {
            int userId = 0;
            var abc = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            if (int.TryParse(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out userId))
                return userId;
            else
                throw new CustomException("Logged in User Id should not be null");
        }

        public async Task<(string Token, string RefreshToken, string UserOrDj)> GenerateTokenByRefreshToken(LoginDetails request)
        {
            if (request == null || request.Id == 0 || !ValidateRefreshToken(request.RefreshToken, request.Id))
            {
                _logger.LogError("Invalid refresh token for user with ID: {UserId}.", request.Id);
                throw new CustomException($"Invalid refresh token: {request.RefreshToken}");
            }

            var userDetails = await _context.Users.FindAsync(request.Id);
            var tokens = await GenerateToken(userDetails);

            return (tokens.Token, tokens.RefreshToken, userDetails.UserOrDj);
        }

        public bool ValidateRefreshToken(string refreshToken, long userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryDate < DateTime.Now)
            {
                return false;
            }

            return true;
        }
    }
}
