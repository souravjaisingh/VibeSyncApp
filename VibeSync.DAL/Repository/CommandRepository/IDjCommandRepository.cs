using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public interface IDjCommandRepository
    {
        Task<string> UpdateDj(UpdateDjCommandModel request);
        Task<bool> CreateReview(ReviewDetails request);
    }
}
