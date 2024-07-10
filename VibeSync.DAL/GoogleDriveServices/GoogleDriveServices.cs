using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.GoogleDriveServices
{
    public class GoogleDriveServices : IGoogleDriveServices
    {
        private readonly DriveService _driveService;
        public GoogleDriveServices()
        {
            _driveService = GetDriveService();

        }

        private DriveService GetDriveService()
        {
            string[] scopes = { DriveService.Scope.DriveFile };
            string applicationName = "FileUpload";

            UserCredential credential;
            

            using (var stream = new FileStream("GoogleDriveCredentials.json", FileMode.Open, FileAccess.Read))
            {
                string credPath = "token_uri.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;

                return new DriveService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = applicationName,
                });
            }

        }
       

        public async Task<string> UploadFileAndGetUrlAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is null or empty", nameof(file));
            }
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = file.FileName,
                Parents = new List<string> { }
            };

            FilesResource.CreateMediaUpload request;
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                request = _driveService.Files.Create(
                    fileMetadata, stream, file.ContentType);
                request.Fields = "id";
                await request.UploadAsync();
            }
            var fileResult = request.ResponseBody;
            return $"https://drive.google.com/file/d/{fileResult.Id}/view";
        }

        
    }
}


    
