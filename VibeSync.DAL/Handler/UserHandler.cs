using MediatR;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// User Handler
    /// </summary>
    /// <seealso cref="IRequestHandler&lt;User, string&gt;" />
    public class UserHandler : IRequestHandler<User, long>,
        IRequestHandler<LoginUser, bool>,
        IRequestHandler<GetUserId, long>
    {
        /// <summary>
        /// The user command repository
        /// </summary>
        private readonly IUserCommandRepository _userCommandRepository;
        /// <summary>
        /// The user query repository
        /// </summary>
        private readonly IUserQueryRepository _userQueryRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserHandler"/> class.
        /// </summary>
        /// <param name="userCommandRepository">The user command repository.</param>
        public UserHandler(IUserCommandRepository userCommandRepository, IUserQueryRepository userQueryRepository)
        {
            _userQueryRepository = userQueryRepository;
            _userCommandRepository = userCommandRepository;
        }

        /// <summary>
        /// Handles a request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>
        /// Response from the request
        /// </returns>
        public async Task<long> Handle(User request, CancellationToken cancellationToken)
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
        public Task<bool> Handle(LoginUser request, CancellationToken cancellationToken)
        {
            var userDetails = _userQueryRepository.ChecksIfUserIsValid(request.Email, request.Password);
            if (userDetails != null)
                return Task.FromResult(true);
            return Task.FromResult(false);
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
    }
}
