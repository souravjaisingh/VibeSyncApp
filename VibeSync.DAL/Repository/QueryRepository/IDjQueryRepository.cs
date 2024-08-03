using VibeSyncModels.Request_ResponseModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IDjQueryRepository
    {
        DjProfileResponseModel GetDjProfileByUserId(GetDjProfileRequestModel request);
        Task<IEnumerable<GetReviewResponseModel>> GetReviews(GetReviewRequestModel request);
    }
}
