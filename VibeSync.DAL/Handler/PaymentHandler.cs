using MediatR;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// PaymentHandler 
    /// </summary>
    public class PaymentHandler : IRequestHandler<GetPaymentOrderId, GetPaymentInitiationDetails>
        , IRequestHandler<PersistSongHistoryPaymentRequest, bool>,
        IRequestHandler<GetDjPaymentsRequestModel, List<PaymentResponseModel>>
        , IRequestHandler<RefundRequest, Refund>,
        IRequestHandler<PromocodeApplicableForUserQueryModel, bool>
    {
        private readonly IPaymentQueryRepository _paymentqueryRepository;
        private readonly IPaymentCommandRepository _paymentCommandRepository;
        private readonly ISongCommandRepository _songCommandRepository;
        public PaymentHandler(IPaymentQueryRepository paymentQueryRepository
            , IPaymentCommandRepository paymentCommand
            , ISongCommandRepository songCommand)
        {
            _paymentqueryRepository = paymentQueryRepository;
            _paymentCommandRepository = paymentCommand;
            _songCommandRepository = songCommand;
        }

        /// <summary>
        /// Returns the orderId that is required for initiating a payment
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<GetPaymentInitiationDetails> Handle(GetPaymentOrderId request, CancellationToken cancellationToken)
        {
            return _paymentqueryRepository.GetPaymentOrderId(request);
        }

        public async Task<bool> Handle(PersistSongHistoryPaymentRequest request, CancellationToken cancellationToken)
        {
            try
            {
                long songHistoryId;
                _songCommandRepository.AddSongHistoryForUser(request, out songHistoryId);

                if (songHistoryId > 0)
                {
                    try
                    {
                        long paymentId = await _paymentCommandRepository.PersistPaymentData(request, songHistoryId);
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

        public async Task<List<PaymentResponseModel>> Handle(GetDjPaymentsRequestModel request, CancellationToken cancellationToken)
        {
            return await _paymentqueryRepository.GetDjPayments(request);
        }

        public async Task<Refund> Handle(RefundRequest request, CancellationToken cancellationToken)
        {
            return await _paymentCommandRepository.RefundPayment(request.PaymentId, request.Amount, request.UserId);
        }

        public async Task<bool> Handle(PromocodeApplicableForUserQueryModel request, CancellationToken cancellationToken)
        {
            return await _paymentqueryRepository.PromocodeApplicableForUser(request);
        }
    }

}

