using FirebaseAdmin.Messaging;
using MediatR;
using System.Reflection.Metadata;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Handler
{
    public class DeviceManagementHandler : IRequestHandler<DeviceManagement, string>
    {
        private readonly IDeviceManagementCommandRepository _deviceManagementCommandRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="DjHandler"/> class.
        /// </summary>
        /// <param name="djCommandRepository">The dj command repository.</param>
        public DeviceManagementHandler(IDeviceManagementCommandRepository deviceManagementCommandRepository)
        {
            _deviceManagementCommandRepository = deviceManagementCommandRepository;
        }
        public async Task<string> Handle(DeviceManagement request, CancellationToken cancellationToken)
        {
            await _deviceManagementCommandRepository.InsertDeviceManagement(request);
            return Constants.Success;
        }
    }
}
