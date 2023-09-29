using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public interface ISongCommandRepository
    {
        void AddSongHistoryForUser(PersistSongHistoryPaymentRequest request, out long songHistoryId);
        Task<string> UpdateSongHistory(SongHistoryModel request);
    }
}
