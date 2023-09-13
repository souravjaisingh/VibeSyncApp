using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// 
    /// </summary>
    public interface IPaymentCommandRepository
    {
        /// <summary>
        /// Persists orderId in Payments table
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="orderId"></param>
        /// <returns></returns>
        Task<long> PersistOrderId(int userId, string orderId, decimal amount);
    }
}
