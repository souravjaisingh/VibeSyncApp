using AutoMapper;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;
using VibeSyncModels;
using System;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class DeviceManagementCommandRepository : IDeviceManagementCommandRepository
    {
        private readonly VibeSyncContext _context;
        public DeviceManagementCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
        }

        public async Task<bool> InsertDeviceManagement(DeviceManagement request)
        {
            request.CreatedOn = DateTime.Now;
            _context.Set<DeviceManagement>().Add(request);

            try
            {
                var response = await _context.SaveChangesAsync();
                if (response > 0)
                {
                    return true;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
            catch (Exception ex)
            {

                throw new CustomException(ex);
            }
        }
    }
}
