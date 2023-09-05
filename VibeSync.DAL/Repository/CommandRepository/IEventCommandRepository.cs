using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public interface IEventCommandRepository
    {
        Task<long> CreateEvent(EventsDetails request);
        Task<EventsDetails> UpdateEvent(EventsDetails request);
    }
}
