using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// 
    /// </summary>
    public interface IPaymentCommandRepository
    {
        Task<long> PersistOrderId(int userId, string orderId, decimal amount);
        Task<long> PersistPaymentData(PersistSongHistoryPaymentRequest request, long songHistoryId);
    }
}
