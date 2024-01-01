using Razorpay.Api;
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
        Task<Refund> RefundPayment(string paymentId, decimal amount, long userId);
        Task<long> PersistRefundData(Refund request);
    }
}
