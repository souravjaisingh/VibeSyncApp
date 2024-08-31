using FirebaseAdmin.Messaging;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

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
                var songHistoryId = _songCommandRepository.UpdateSongHistoryFromWebHook(request.payload.payment.entity.order_id);

                var paymentEntity = request.payload.payment.entity;

                if (songHistoryId > 0)
                {
                    try
                    {
                        long paymentId = await _paymentCommandRepository.UpdatePaymentDetailsFromWebHook(request.payload.payment.entity.order_id, songHistoryId, request.payload.payment.entity.id, (request.payload.payment.entity.amount / 100), paymentEntity.contact);
                        if (paymentId > 0)
                        {
                            _ = SendNotificationToDj(songHistoryId);
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
            catch (Exception)
            {
                return false;
            }
        }

        private async Task SendNotificationToDj(long songHistoryId)
        {
            var djId = _songQueryRepository.GetSongHistoryById(songHistoryId).DjId;
            var deviceManagement = _deviceManagementQueryRepository.GetDeviceManagementByDjId(djId);
            var registrationTokens = new List<string>(){};
            var message = new MulticastMessage()
            {
                Tokens = registrationTokens,
                Data = new Dictionary<string, string>()
                {
                    { "score", "850" },
                    { "time", "2:45" },
                },
            };

            var response = await FirebaseMessaging.DefaultInstance.SendEachForMulticastAsync(message);
            // See the BatchResponse reference documentation
            // for the contents of response.
            _logger.LogInformation($"SendNotificationToDj - {response.SuccessCount} messages were sent successfully");
        }
    }
}
