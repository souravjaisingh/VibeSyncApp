using MediatR;
using System.Collections.Generic;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    public class DjHandler : IRequestHandler<UpdateDjCommandModel, string>, 
        IRequestHandler<GetDjProfileRequestModel, DjProfileResponseModel>,
        IRequestHandler<GetReviewRequestModel, IEnumerable<GetReviewResponseModel>>
    {
        /// <summary>
        /// The dj command repository
        /// </summary>
        private readonly IDjCommandRepository _djCommandRepository;
        private readonly IDjQueryRepository _djQueryRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="DjHandler"/> class.
        /// </summary>
        /// <param name="djCommandRepository">The dj command repository.</param>
        public DjHandler(IDjCommandRepository djCommandRepository, IDjQueryRepository djQueryRepository)
        {
            _djCommandRepository = djCommandRepository;
            _djQueryRepository = djQueryRepository;
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

        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<DjProfileResponseModel> Handle(GetDjProfileRequestModel request, CancellationToken cancellationToken)
        {
            return await Task.Run(() => _djQueryRepository.GetDjProfileByUserId(request));
        }
        public Task<IEnumerable<GetReviewResponseModel>> Handle(GetReviewRequestModel request, CancellationToken cancellationToken)
        {
            return _djQueryRepository.GetReviews(request);
        }
    }
}
