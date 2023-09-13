using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.EntityModels;

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
            catch(Exception ex)
            {
                Console.WriteLine(ex.InnerException);
            }
            return 0;
        }
    }
}
