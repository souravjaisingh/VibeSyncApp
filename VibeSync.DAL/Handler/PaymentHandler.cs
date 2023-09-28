using MediatR;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// PaymentHandler 
    /// </summary>
    public class PaymentHandler : IRequestHandler<GetPaymentOrderId, GetPaymentInitiationDetails>
        , IRequestHandler<PersistSongHistoryPaymentRequest, bool>
    {
        private readonly IPaymentQueryRepository _payment;
        private readonly IPaymentCommandRepository _paymentCommand;
        private readonly ISongCommandRepository _songCommand;
        private readonly VibeSyncContext _context;
        public PaymentHandler(IPaymentQueryRepository paymentQueryRepository
            , IPaymentCommandRepository paymentCommand
            , ISongCommandRepository songCommand
            , IDBContextFactory context)
        {
            _payment = paymentQueryRepository;
            _paymentCommand = paymentCommand;
            _songCommand = songCommand;
            _context = context.GetDBContext();
        }

        /// <summary>
        /// Returns the orderId that is required for initiating a payment
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<GetPaymentInitiationDetails> Handle(GetPaymentOrderId request, CancellationToken cancellationToken)
        {
            return _payment.GetPaymentOrderId(request);
        }

        public async Task<bool> Handle(PersistSongHistoryPaymentRequest request, CancellationToken cancellationToken)
        {
            try
            {
                long songHistoryId;
                _songCommand.AddSongHistoryForUser(request, out songHistoryId);

                if (songHistoryId > 0)
                {
                    try
                    {
                        long paymentId = await _paymentCommand.PersistPaymentData(request, songHistoryId);
                        if (paymentId > 0)
                        {
                            return true;
                        }
                    }
                    catch (Exception paymentException)
                    {
                        return false;
                    }
                }
                return false;
            }
            catch (Exception songCommandException)
            {
                return false;
            }
        }
    }

}

