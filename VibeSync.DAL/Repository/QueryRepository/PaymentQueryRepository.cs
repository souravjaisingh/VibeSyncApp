using Microsoft.Extensions.Configuration;
using Razorpay.Api;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// PaymentQueryRepository
    /// </summary>
    public class PaymentQueryRepository : IPaymentQueryRepository
    {
        private readonly IUserQueryRepository _user;
        private readonly IPaymentCommandRepository _paymentCommand;
        private readonly VibeSyncContext _context;
        public PaymentQueryRepository(IPaymentCommandRepository paymentCommand
            , IUserQueryRepository user, IDBContextFactory context)
        {
            _paymentCommand = paymentCommand;
            _user = user;
            _context = context.GetDBContext();
        }

        public Task<List<PaymentResponseModel>> GetDjPayments(GetDjPaymentsRequestModel request)
        {
            var query = _context.SongHistories.AsQueryable();
            if (request.EventId > 0 && request.DjId > 0)
            {
                query = query.Where(s => s.EventId == request.EventId && s.DjId == request.DjId);
            }
            else if (request.DjId > 0)
            {
                query = query.Where(s => s.DjId == request.DjId);
            }
            else if (request.EventId > 0)
            {
                query = query.Where(s => s.EventId == request.EventId);
            }

            var paymentTransactions = query
                .Join(
                    _context.Payments.Where(d => d.PaymentStatus == VibeSyncModels.Enums.PaymentStatus.PaymentSucceeded.ToString() && d.PaymentId != null),
                    songHistory => songHistory.Id,
                    payment => payment.SongHistoryId,
                    (songHistory, payment) => new PaymentResponseModel
                    {
                        Id = payment.Id,
                        SongHistoryId = payment.SongHistoryId,
                        BidAmount = payment.BidAmount,
                        Discount = payment.Discount,
                        UserId = payment.UserId,
                        CreatedBy = payment.CreatedBy,
                        CreatedOn = payment.CreatedOn,
                        ModifiedBy = payment.ModifiedBy,
                        ModifiedOn = payment.ModifiedOn,
                        PaymentId = payment.PaymentId,
                        PaymentStatus = payment.PaymentStatus,
                        OrderId = payment.OrderId,
                        PaymentSource = payment.PaymentSource,
                        Promocode = payment.Promocode,
                        Signature = payment.Signature,
                        TotalAmount = payment.TotalAmount
                    }
                ).OrderBy(x => x.ModifiedOn).ThenByDescending(res => res.ModifiedOn)
                .ToList();

            return Task.FromResult(paymentTransactions);
        }

        ///// <summary>
        ///// GetPaymentOrderId
        ///// </summary>
        ///// <returns>OrderId necessary for initiating payment</returns>
        public async Task<GetPaymentInitiationDetails> GetPaymentOrderId(GetPaymentOrderId request)
        {
            var AppId = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("RazorpayPayments")["AppId"];
            var ClientSecret = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("RazorpayPayments")["SecretKey"];

            RazorpayClient client = new RazorpayClient(AppId, ClientSecret);

            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount", request.Amount); // amount in the smallest currency unit - paise
            options.Add("currency", "INR");
            Order order = client.Order.Create(options);

            // payIdentity is the primary key of payments table(identity column)
            var payIdentity = await _paymentCommand.PersistOrderId(request.UserId, order["id"].ToString(), request.Amount);
            var user = _user.GetUserById(request.UserId);
            var res = new GetPaymentInitiationDetails()
            {
                OrderId = order["id"].ToString(),
                PaymentIdentity = payIdentity,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber
            };
            return res;
        }
    }
}
