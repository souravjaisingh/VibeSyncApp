using Google.Apis.Drive.v3;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.GoogleDriveServices
{
    public interface IGoogleDriveServices
    {
        Task<string> UploadFileAndGetUrlAsync(IFormFile file);
    }
}
