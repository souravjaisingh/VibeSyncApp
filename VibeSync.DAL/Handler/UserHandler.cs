using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// User Handler
    /// </summary>
    /// <seealso cref="IRequestHandler&lt;User, string&gt;" />
    public class UserHandler : IRequestHandler<User, string>,
        IRequestHandler<LoginUser, bool>
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
        public async Task<string> Handle(User request, CancellationToken cancellationToken)
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
    }
}
