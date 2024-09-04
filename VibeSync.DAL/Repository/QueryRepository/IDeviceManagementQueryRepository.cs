using System.Collections.Generic;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IDeviceManagementQueryRepository
    {
        List<DeviceManagement> GetDeviceManagementByDjId(long djid);
    }
}
