using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Razorpay.Api;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;
using Constants = VibeSyncModels.Constants;
using Payment = VibeSyncModels.EntityModels.Payment;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// PaymentsCommandRepository
    /// </summary>
    public class PaymentCommandRepository : IPaymentCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;

        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;

        /// <summary>
        /// ILogger
        /// </summary>
        private readonly ILogger<PaymentCommandRepository> _logger;

        public PaymentCommandRepository(IDBContextFactory context, IMapper mapper, ILogger<PaymentCommandRepository> logger)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
            _logger = logger;
        }
        /// <summary>
        /// Persists orderid in payments table
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="orderId"></param>
        /// <returns></returns>
        public async Task<long> PersistOrderId(int userId, string orderId, decimal amount)
        {
            _logger.LogInformation("PersistOrderId - Request: UserId = " + userId + ", orderId = " + orderId + ", amount = " + amount);
            try
            {
                var payment = new Payment()
                {
                    BidAmount = amount,
                    UserId = userId,
                    OrderId = orderId,
                    CreatedOn = DateTime.Now,
                    CreatedBy = userId.ToString(),
                    PaymentSource = userId.ToString(),
                    PaymentStatus = Constants.PaymentOrderIdCreated
                };
                _logger.LogInformation("PersistOrderId - payment :" + JsonConvert.SerializeObject(payment));
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
                return payment.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError("PersistOrderId - Exception :" + JsonConvert.SerializeObject(ex));
            }
            return 0;
        }

        public async Task<long> PersistPaymentData(PersistSongHistoryPaymentRequest request, long songHistoryId)
        {
            _logger.LogInformation("PersistPaymentData - request :" + JsonConvert.SerializeObject(request));
            if(request.OrderId == Constants.PaidZeroUsingPromocode)
            {
                var payment = new Payment()
                {
                    BidAmount = request.TotalAmount,
                    UserId = request.UserId,
                    OrderId = Constants.PaidZeroUsingPromocode,
                    CreatedOn = DateTime.Now,
                    CreatedBy = request.UserId.ToString(),
                    PaymentSource = request.UserId.ToString(),
                    PaymentStatus = VibeSyncModels.Enums.PaymentStatus.PaymentSucceeded.ToString(),
                    PaymentId = request.PaymentId,
                    SongHistoryId = songHistoryId,
                };
                _logger.LogInformation("PersistPayment - "+ Constants.PaidZeroUsingPromocode +" :" + JsonConvert.SerializeObject(payment));
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
                return payment.Id;
            }
            else
            {
                var paymentRecord = _context.Payments.FirstOrDefault(x => x.OrderId == request.OrderId);

                if (paymentRecord?.OrderId != null)
                {
                    paymentRecord.PaymentStatus = VibeSyncModels.Enums.PaymentStatus.PaymentSucceeded.ToString();
                    paymentRecord.PaymentId = request.PaymentId;
                    paymentRecord.TotalAmount = request.TotalAmount;
                    paymentRecord.SongHistoryId = songHistoryId;
                    paymentRecord.ModifiedBy = request.UserId.ToString();
                    paymentRecord.ModifiedOn = DateTime.Now;

                    _logger.LogInformation("PersistPaymentData - paymentRecord :" + JsonConvert.SerializeObject(paymentRecord));
                    _context.Payments.Update(paymentRecord);

                    _context.SaveChanges();
                }
                return await Task.FromResult(paymentRecord?.Id ?? 0);
            }
            
        }

        public async Task<Refund> RefundPayment(string paymentId, decimal amount, long userId)
        {
            _logger.LogInformation("RefundPayment - paymentId :" + paymentId + ", amount" + amount + ", userId: "+userId);
            var AppId = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("RazorpayPayments")["AppId"];
            var ClientSecret = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("RazorpayPayments")["SecretKey"];

            //initialize the SDK client
            RazorpayClient client = new RazorpayClient(AppId, ClientSecret);

            Dictionary<string, object> refundRequest = new Dictionary<string, object>();
            refundRequest.Add("amount", amount * 100);
            refundRequest.Add("speed", "normal");
            Dictionary<string, object> notes = new Dictionary<string, object>();
            notes.Add("user", userId);
            refundRequest.Add("notes", notes);

            Refund refund = client.Payment.Fetch(paymentId).Refund(refundRequest);
            _logger.LogInformation("RefundPayment complete - response :" + JsonConvert.SerializeObject(refund));
            return await Task.FromResult(refund);
        }
    }
}
