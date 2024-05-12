using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Razorpay.Api;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSyncModels;
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
        private readonly ISongCommandRepository _songCommand;

        /// <summary>
        /// The HTTP context accessor
        /// </summary>
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PaymentQueryRepository(IPaymentCommandRepository paymentCommand,
            ISongCommandRepository songCommandRepository,
            IUserQueryRepository user, 
            IDBContextFactory context, 
            IHttpContextAccessor httpContextAccessor)
        {
            _paymentCommand = paymentCommand;
            _user = user;
            _context = context.GetDBContext();
            _httpContextAccessor = httpContextAccessor;
            _songCommand = songCommandRepository;
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

            var result = query
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

            long songHistoryId;

            PersistSongHistoryPaymentRequest target = new()
            {
                UserId = request.UserId,
                TotalAmount = request.TotalAmount,
                EventId = request.EventId,
                DjId = request.DjId,
                SongId = request.SongId,
                SongName = request.SongName,
                ArtistId = request.ArtistId,
                ArtistName = request.ArtistName,
                AlbumName = request.AlbumName,
                AlbumImage = request.AlbumImage,
                OrderId = order["id"].ToString(),
                SongStatus = Constants.SongStatusPaymentInProgress
            };

            _songCommand.AddSongHistoryForUser(target, out songHistoryId);

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

        public Task<bool> PromocodeApplicableForUser(PromocodeApplicableForUserQueryModel request)
        {
            var userId = loggedInUserId();
            var songHistory  = _context.SongHistories.Where(x => x.UserId == userId && (x.SongStatus == Constants.SongStatusAccepted || x.SongStatus == Constants.SongStatusPlayed || x.SongStatus == Constants.SongStatusPending)).FirstOrDefault();
            if (songHistory != null && songHistory != default)
            {
                return Task.FromResult(false);
            }
            return Task.FromResult(true);
        }

        private int loggedInUserId()
        {
            int userId = 0;
            if (int.TryParse(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out userId))
                return userId;
            else
                throw new CustomException("Logged in User Id should not be null");
        }
    }
}
