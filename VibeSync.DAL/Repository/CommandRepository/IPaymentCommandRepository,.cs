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
        Task<long> PersistOrderId(long userId, string orderId, decimal amount);
        Task<long> PersistPaymentData(PersistSongHistoryPaymentRequest request, long songHistoryId);
        Task<Refund> RefundPayment(string paymentId, decimal amount, long userId);
        Task<long> UpdatePaymentDetailsFromWebHook(string orderId, long songHistoryId, string paymentId, decimal totalAmount, string contact = null);
    }
}
