using MediatR;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    public class DjHandler : IRequestHandler<UpdateDjCommandModel, string>
    {
        /// <summary>
        /// The dj command repository
        /// </summary>
        private readonly IDjCommandRepository _djCommandRepository;
        /// <summary>
        /// Initializes a new instance of the <see cref="DjHandler"/> class.
        /// </summary>
        /// <param name="djCommandRepository">The dj command repository.</param>
        public DjHandler(IDjCommandRepository djCommandRepository)
        {
            _djCommandRepository = djCommandRepository;
        }
        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<string> Handle(UpdateDjCommandModel request, CancellationToken cancellationToken)
        {
            return await _djCommandRepository.UpdateDj(request);
        }
    }
}
