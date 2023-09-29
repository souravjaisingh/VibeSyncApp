using AutoMapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

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

        public PaymentCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
        }
        /// <summary>
        /// Persists orderid in payments table
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="orderId"></param>
        /// <returns></returns>
        public async Task<long> PersistOrderId(int userId, string orderId, decimal amount)
        {
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
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
                return payment.Id;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException);
            }
            return 0;
        }

        public async Task<long> PersistPaymentData(PersistSongHistoryPaymentRequest request, long songHistoryId)
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
                _context.Payments.Update(paymentRecord);

                _context.SaveChanges();
            }

            // Note: We don't call SaveChanges here; we leave it to the caller of this method.

            return await Task.FromResult(paymentRecord?.Id ?? 0);
        }

    }
}
