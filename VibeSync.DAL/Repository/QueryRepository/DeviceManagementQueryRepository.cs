using System.Collections.Generic;
using System.Linq;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public class DeviceManagementQueryRepository : IDeviceManagementQueryRepository
    {
        private readonly VibeSyncContext _context;
        
        public DeviceManagementQueryRepository(IDBContextFactory context)
        {
            _context = context.GetDBContext();
        }
        public List<DeviceManagement> GetDeviceManagementByDjId(long djid)
        {
          return _context.DeviceManagements.Where(x => x.DjId == djid).ToList();
        }
    }
}
