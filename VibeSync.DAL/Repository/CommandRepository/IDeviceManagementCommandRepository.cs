using System.Threading.Tasks;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public interface IDeviceManagementCommandRepository
    {
        Task<bool> InsertDeviceManagement(DeviceManagement request);
    }
}
