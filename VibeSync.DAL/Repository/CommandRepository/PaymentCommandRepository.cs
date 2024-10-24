﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
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
        /// ILogger
        /// </summary>
        private readonly ILogger<PaymentCommandRepository> _logger;

        public PaymentCommandRepository(IDBContextFactory context, ILogger<PaymentCommandRepository> logger)
        {
            _context = context.GetDBContext();
            _logger = logger;
        }
        /// <summary>
        /// Persists orderid in payments table
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="orderId"></param>
        /// <returns></returns>
        public async Task<long> PersistOrderId(long userId, string orderId, decimal amount)
        {
            _logger.LogInformation("PersistOrderId - Request: UserId = " + userId + ", orderId = " + orderId + ", amount = " + amount);
            try
            {
                var payment = new Payment()
                {
                    BidAmount = amount,
                    UserId = userId,
                    OrderId = orderId,
                    CreatedOn = GetISTDateTime(),
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
            if (request.OrderId == Constants.PaidZeroUsingPromocode)
            {
                var payment = new Payment()
                {
                    BidAmount = request.TotalAmount,
                    UserId = request.UserId,
                    OrderId = Constants.PaidZeroUsingPromocode,
                    CreatedOn = GetISTDateTime(),
                    CreatedBy = request.UserId.ToString(),
                    PaymentSource = request.UserId.ToString(),
                    PaymentStatus = VibeSyncModels.Enums.PaymentStatus.PaymentSucceeded.ToString(),
                    PaymentId = request.PaymentId,
                    SongHistoryId = songHistoryId,
                };
                _logger.LogInformation("PersistPayment - " + Constants.PaidZeroUsingPromocode + " :" + JsonConvert.SerializeObject(payment));
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
                    paymentRecord.ModifiedOn = GetISTDateTime();

                    _logger.LogInformation("PersistPaymentData - paymentRecord :" + JsonConvert.SerializeObject(paymentRecord));
                    _context.Payments.Update(paymentRecord);

                    _context.SaveChanges();
                }
                return await Task.FromResult(paymentRecord?.Id ?? 0);
            }

        }

        public async Task<Refund> RefundPayment(string paymentId, decimal amount, long userId)
        {
            _logger.LogInformation("RefundPayment - paymentId :" + paymentId + ", amount" + amount + ", userId: " + userId);
            var AppId = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("RazorpayPayments")["AppId"];
            var ClientSecret = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("RazorpayPayments")["SecretKey"];

            //initialize the SDK client
            RazorpayClient client = new RazorpayClient(AppId, ClientSecret);

            Dictionary<string, object> refundRequest = new Dictionary<string, object>();
            refundRequest.Add("amount", amount * 100);
            refundRequest.Add("speed", "optimum");
            Dictionary<string, object> notes = new Dictionary<string, object>();
            notes.Add("user", userId);
            refundRequest.Add("notes", notes);

            Refund refund = client.Payment.Fetch(paymentId).Refund(refundRequest);
            _logger.LogInformation("RefundPayment complete - response :" + JsonConvert.SerializeObject(refund));
            return await Task.FromResult(refund);
        }
        
        public async Task<long> UpdatePaymentDetailsFromWebHook(string orderId, long songHistoryId, string paymentId, decimal totalAmount, string contact = null)
        {
            var paymentRecord = _context.Payments.FirstOrDefault(x => x.OrderId == orderId);

            if (paymentRecord?.OrderId != null)
            {
                paymentRecord.PaymentStatus = VibeSyncModels.Enums.PaymentStatus.PaymentSucceeded.ToString();
                paymentRecord.PaymentId = paymentId;
                paymentRecord.TotalAmount = totalAmount;
                paymentRecord.SongHistoryId = songHistoryId;
                paymentRecord.ModifiedBy = "webhook";
                paymentRecord.ModifiedOn = GetISTDateTime();
                paymentRecord.Contact = contact;
                _logger.LogInformation("UpdatePaymentDetailsFromWebHook - paymentRecord :" + JsonConvert.SerializeObject(paymentRecord));
                _context.Payments.Update(paymentRecord);

                _context.SaveChanges();
            }
            return await Task.FromResult(paymentRecord?.Id ?? 0);
        }

        public static DateTime GetISTDateTime()
        {
            DateTime utcNow = DateTime.UtcNow;
            TimeSpan istOffset = TimeSpan.FromHours(5.5);
            DateTime istTime = utcNow + istOffset;
            return istTime;
        }
    }
}
