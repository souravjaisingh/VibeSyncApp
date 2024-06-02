using MediatR;
using System;
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
                var songHistoryId = _songCommandRepository.UpdateSongHistoryFromWebHook(request.payload.payment.entity.order_id);

                var paymentEntity = request.payload.payment.entity;

                if (songHistoryId > 0)
                {
                    try
                    {
                        long paymentId = await _paymentCommandRepository.UpdatePaymentDetailsFromWebHook(request.payload.payment.entity.order_id, songHistoryId, request.payload.payment.entity.id, (request.payload.payment.entity.amount / 100));
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
