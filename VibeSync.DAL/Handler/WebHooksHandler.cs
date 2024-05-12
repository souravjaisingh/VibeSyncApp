using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        public WebHooksHandler(IPaymentQueryRepository paymentQueryRepository
            , IPaymentCommandRepository paymentCommand
            , ISongCommandRepository songCommand
            , ISongQueryRepository songQueryRepository)
        {
            _paymentqueryRepository = paymentQueryRepository;
            _paymentCommandRepository = paymentCommand;
            _songCommandRepository = songCommand;
            _songQueryRepository = songQueryRepository;
        }

        public async Task<bool> Handle(RazorpayWebhookPayload request, CancellationToken cancellationToken)
        {
            try
            {
                var songHistoryId = _songCommandRepository.UpdateSongHistoryFromWebHook(request.Payload.Payment.Entity.Order_Id);

                var paymentEntity = request.Payload.Payment.Entity;

                if (songHistoryId > 0)
                {
                    try
                    {
                        long paymentId = await _paymentCommandRepository.UpdatePaymentDetailsFromWebHook(request.Payload.Payment.Entity.Order_Id, songHistoryId, request.Payload.Payment.Entity.Id, (request.Payload.Payment.Entity.Amount / 100));
                        if (paymentId > 0)
                        {
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
    }
}
