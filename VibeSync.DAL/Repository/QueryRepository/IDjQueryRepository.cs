using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IDjQueryRepository
    {
        DjProfileResponseModel GetDjProfileByUserId(GetDjProfileRequestModel request);
    }
}
