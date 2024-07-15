using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;
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
        private readonly IConfiguration _configuration;
        private readonly ILogger<GoogleDriveServices> _logger;

        public GoogleDriveServices(IConfiguration configuration,ILogger<GoogleDriveServices> logger)
        {
            _driveService = GetDriveServiceAsync().GetAwaiter().GetResult();
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            try
            {
                _driveService = GetDriveServiceAsync().GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing Google Drive service");
                throw; // Re-throw the exception to propagate it up
            }
        }

        private async Task<DriveService> GetDriveServiceAsync()
        {
           
                string[] scopes = { DriveService.Scope.DriveFile };
                string applicationName = "FileUpload";

                UserCredential credential;
                var clientId = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("GoogleDriveCredentials")["client_id"];
                var clientSecret = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("GoogleDriveCredentials")["client_secret"];
                var RedirectUri = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("GoogleDriveCredentials")["redirect_uris"];
                var tokenPath = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("GoogleDriveCredentials")["token_uri"];
     
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret) || string.IsNullOrEmpty(tokenPath))
                {
                    throw new ApplicationException("Google Drive API credentials are not configured correctly.");
                }
            

            using (var stream = new FileStream(tokenPath, FileMode.Open, FileAccess.Read))
                {
                
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                        new ClientSecrets
                        {
                            ClientId = clientId,
                            ClientSecret = clientSecret
                        },
                        scopes,
                        scopes,
                        "user",
                        CancellationToken.None,
                        new FileDataStore("GoogleDriveApiToken", true));

                    return new DriveService(new BaseClientService.Initializer()
                    {
                        HttpClientInitializer = credential,
                        ApplicationName = applicationName,
                    });
                }
       
        }
       

        public async Task<string> UploadFileAndGetUrlAsync(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    throw new ArgumentException("File is null or empty", nameof(file));
                }

                if (_driveService == null)
                {
                    _logger.LogError("Drive service is not initialized properly.");
                    throw new NullReferenceException("_driveService is not initialized properly.");
                }
                var fileMetadata = new Google.Apis.Drive.v3.Data.File();
                FilesResource.CreateMediaUpload request;
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;
                    request = _driveService.Files.Create(fileMetadata, stream, file.ContentType);
                    request.Fields = "id";
                    await request.UploadAsync();
                }
                var fileResult = request.ResponseBody;
                if (fileResult == null)
                {
                    throw new Exception("File upload failed.");
                }
                return $"https://drive.google.com/file/d/{fileResult.Id}/view";
            }
            catch (ArgumentException ex)
            {
               
                _logger.LogError($"ArgumentException in UploadFileAndGetUrlAsync: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {

                _logger.LogError($"Error in UploadFileAndGetUrlAsync: {ex.Message}");
                throw;
            }

        }

        
    }
}


    
