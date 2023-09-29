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
            var djId = _context.Djs.Where(x => x.UserId == request.UserId).FirstOrDefault().Id;

            var query = _context.SongHistories.AsQueryable();
            if (request.EventId > 0 && djId > 0)
            {
                query = query.Where(s => s.EventId == request.EventId && s.DjId == djId);
            }
            else if (djId > 0)
            {
                query = query.Where(s => s.DjId == djId);
            }
            else if (request.EventId > 0)
            {
                query = query.Where(s => s.EventId == request.EventId);
            }

            var result = _context.SongHistories
                            .Join(
                                _context.Payments,
                                songHistory => songHistory.Id,
                                payment => payment.SongHistoryId,
                                (songHistory, payment) => new
                                {
                                    SongHistory = songHistory,
                                    Payment = payment
                                }
                            )
                            .GroupJoin(
                                _context.Events,
                                join => join.SongHistory.EventId,
                                events => events.Id,
                                (join, eventsGroup) => new
                                {
                                    SongHistory = join.SongHistory,
                                    Payment = join.Payment,
                                    EventsGroup = eventsGroup
                                }
                            )
                            .SelectMany(
                                join => join.EventsGroup.DefaultIfEmpty(),
                                (join, events) => new PaymentResponseModel
                                {
                                    EventName = (events != null) ? events.EventName : null,
                                    SongName = join.SongHistory.SongName,
                                    Id = join.Payment.Id,
                                    SongHistoryId = join.Payment.SongHistoryId,
                                    BidAmount = join.Payment.BidAmount,
                                    Discount = join.Payment.Discount,
                                    UserId = join.Payment.UserId,
                                    CreatedBy = join.Payment.CreatedBy,
                                    CreatedOn = join.Payment.CreatedOn,
                                    ModifiedBy = join.Payment.ModifiedBy,
                                    ModifiedOn = join.Payment.ModifiedOn,
                                    PaymentId = join.Payment.PaymentId,
                                    PaymentStatus = join.Payment.PaymentStatus,
                                    OrderId = join.Payment.OrderId,
                                    PaymentSource = join.Payment.PaymentSource,
                                    Promocode = join.Payment.Promocode,
                                    Signature = join.Payment.Signature,
                                    TotalAmount = join.Payment.TotalAmount
                                }
                            )
                            .ToList();

            return Task.FromResult(result);
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
