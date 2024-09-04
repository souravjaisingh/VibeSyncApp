using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;
using static Google.Apis.Requests.BatchRequest;

namespace VibeSync.DAL.Handler
{
    public class WebHooksHandler : IRequestHandler<RazorpayWebhookPayload, bool>
    {
        private readonly IPaymentQueryRepository _paymentqueryRepository;
        private readonly IPaymentCommandRepository _paymentCommandRepository;
        private readonly ISongCommandRepository _songCommandRepository;
        private readonly ISongQueryRepository _songQueryRepository;
        private readonly IDeviceManagementQueryRepository _deviceManagementQueryRepository;
        private readonly ILogger<WebHooksHandler> _logger;
        public WebHooksHandler(IPaymentQueryRepository paymentQueryRepository
            , IPaymentCommandRepository paymentCommand
            , ISongCommandRepository songCommand
            , ISongQueryRepository songQueryRepository, IDeviceManagementQueryRepository deviceManagementQueryRepository, ILogger<WebHooksHandler> logger)
        {
            _logger = logger;
            _paymentqueryRepository = paymentQueryRepository;
            _paymentCommandRepository = paymentCommand;
            _songCommandRepository = songCommand;
            _songQueryRepository = songQueryRepository;
            _deviceManagementQueryRepository = deviceManagementQueryRepository;
        }
        public async Task<bool> Handle(RazorpayWebhookPayload request, CancellationToken cancellationToken)
        {
            try
            {
                string songName = null;
                var songHistoryId = _songCommandRepository.UpdateSongHistoryFromWebHook(request.payload.payment.entity.order_id, out songName);

                var paymentEntity = request.payload.payment.entity;

                if (songHistoryId > 0)
                {
                    try
                    {
                        long paymentId = await _paymentCommandRepository.UpdatePaymentDetailsFromWebHook(request.payload.payment.entity.order_id, songHistoryId, request.payload.payment.entity.id, (request.payload.payment.entity.amount / 100), paymentEntity.contact);
                        if (paymentId > 0)
                        {
                            _logger.LogInformation($"Calling SendNotificationToDj for songHistoryId: "+songHistoryId+" and songName: "+songName);
                            await SendNotificationToDj(songHistoryId, songName);
                            return true;
                        }
                    }
                    catch (Exception)
                    {
                        return false;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Exception in Webhookshandler: " + ex);
                return false;
            }
        }

        public async Task SendNotificationToDj(long songHistoryId, string songName)
        {
            _logger.LogInformation($"SendNotificationToDj called for songHistoryId: " + songHistoryId + " and songName: " + songName);

            // Get the DJ ID associated with the song history
            var djId = _songQueryRepository.GetSongHistoryById(songHistoryId).DjId;

            // Get the list of device management records associated with the DJ ID
            var deviceManagementList = _deviceManagementQueryRepository.GetDeviceManagementByDjId(djId);

            var jsonContent = @"
                {
                  'type': 'service_account',
                  'project_id': 'vibesync-428906',
                  'private_key_id': '50cf27f8018d6e3ac0e45b7271f5cf1486ce07a1',
                  'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1Zd26mVK5vhuB\nV1kp1YVqpD+h1uMi/iEp92yLYlADJmlI/enPfR5uvnScF2rbJ5//16gRWc4tysTG\n3nDgbzqGW9ISdEIhJASX1jyW85CbGPps+iPYF/MBl+q3wRhkwDMi96X1y7zKVbPh\nkIX5GQcADzGvMXD0+CgaNtAHM4+ud2iNQEd2YxV51wPkxlWKbh693fF3tK200kf1\ntKj343VKC9y0EbaD0AzvpS6i6Z70oXv8apgT2KiaZxpSvmLX2xjsYlGy5hu3rZlD\nlOafEoZdPo4GAYXcUPJMWzD5NYpmgUzng84uXa2LRxSolBjHDFukhOGPyBaC91YQ\nPhXv5hXbAgMBAAECggEAG/cV3VgY1FDWHbURJm1oEZ47vyAJSVJDW5xs6/oemrW3\nwox+mMHRyMHs6UmE7D9qH7+oBfDB4/ZgKsaNQVR0gdUzCCxLK5/JY30gPydSkk6i\nAN35W62phYPdqDGJKLMmzwu91qxvsQPQZQRqWxI8LYqqHrexEdsWF6B+prWQv5Uf\nUGeEBilv33z6XK72UNBHM2lJZl/BD/64xDWFZtole/2nSWcdaw8wq3nVsLvIGmxh\nPv96F6u7cDsNf9cBHoNYKbE0kWXUcGXNKN//XYJb5MkeSuvCtC5lbvNYkKj/8yzQ\nK1wvhoLGq8pFkKr74sU2Mbaq4zHj5g+ObSLN62ny8QKBgQDt796tJrbGgaCvATWZ\nhzXuW9OzN5sZiGPw6+FIkonUtO9Zwo5I6LiOAdgHGKqru7E12xtq8i29Ge49idDg\n4XtjqPNNaPyfqw8P7YDsTzF/f0OcgVcohKBhmHDGUySyQBanoITD+AwYK5vGx0DG\nmejCNvUejjiEE72ggIsrrETr6wKBgQDDKzNzree5gQo1rm/B4kprTRYEcC/j6va2\nvacyhm1lFgBD+khiD2Bsu3FGif5EVgbYeK5N+mlHmwN9/IPtIMPM5xF2knGnXv+3\nzRxfBEpyb1R471LLT1Nh+94qV2C0xi1YSL+L34d8JfbARN0UvQ4Wpigtrnim0eeK\nCfKc4Iyx0QKBgA294cVsS/gQ+n/A+SCBz5qRkRtzpbCG0QbUCLHRTMaNIJm1g9Qw\nJKCG+LwIL6s1btmmauH1VLDsM3c4Y2jpfN/XnR2mZ5itH3STCfQb6sbrSbNbQPZl\nGoIodLLvkFn/G4/Y1HIg/EnVEu0bCuGtd+TnmaaHHjp6jWQcqG0ASQa7AoGAc8dH\nCJLb6oIQanQGvD/f4fOi4hMjddPHc/TiIOj6MINyuODa28E/dIFl23C1NBjMitJc\npMmudtoQokaQhLVxMjbJd0u8vItwq7qz3/INsAE3XV6sAQwX7QKbcwbOya7e64aM\niw+Zsh5bWQgBFvJoTytWnnLoBB51esAX+tSC4mECgYEAkieZMjqT75YkTsP1+45N\nko7dpz7yrEoPBsJD+HN5wTBY/1nuYzz48fpyoB6gJWkwfj7oWaAeLs05Uc5naSyn\nVwqNOB71nK9k1DR2tbEsMD3Vp4vJ0HMrfp6pgDJ5j0GecebZq3O1U7kHaNmqV0kg\nm8XdLOVICUuMzVAv5G6mAR0=\n-----END PRIVATE KEY-----\n',
                  'client_email': 'firebase-adminsdk-zr7si@vibesync-428906.iam.gserviceaccount.com',
                  'client_id': '113626246747207328314',
                  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                  'token_uri': 'https://oauth2.googleapis.com/token',
                  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
                  'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zr7si%40vibesync-428906.iam.gserviceaccount.com',
                  'universe_domain': 'googleapis.com'
                }";

            // Parse the JSON content into a GoogleCredential
            var googleCredential = GoogleCredential.FromJson(jsonContent);

            // Initialize FirebaseApp if it hasn't been initialized yet
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions()
                {
                    Credential = googleCredential,
                });
            }


            // Initialize a HashSet to hold all unique FCM tokens
            var registrationTokens = new HashSet<string>();

            // Iterate through each device management record and add the FCM token to the HashSet
            foreach (var device in deviceManagementList)
            {
                if (!string.IsNullOrEmpty(device.FcmToken))
                {
                    registrationTokens.Add(device.FcmToken);
                }
            }

            var notification = new Notification
            {
                Title = "New song request!",
                Body = songName,
            };

            // Create a multicast message with the collected FCM tokens
            var message = new MulticastMessage()
            {
                Tokens = registrationTokens.ToList(),
                Notification = notification
            };

            // Send the message to all FCM tokens
            var response = await FirebaseMessaging.DefaultInstance.SendEachForMulticastAsync(message);

            // Log the success count
            _logger.LogInformation($"SendNotificationToDj - {response.SuccessCount} messages were sent successfully");
        }

    }
}
