using System.Collections.Generic;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// IPaymentQueryRepository
    /// </summary>
    public interface IPaymentQueryRepository
    {
        /// <summary>
        /// Gets the events with dj information.
        /// </summary>
        /// <returns></returns>
        Task<GetPaymentInitiationDetails> GetPaymentOrderId(GetPaymentOrderId request);
        Task<List<PaymentResponseModel>> GetDjPayments(GetDjPaymentsRequestModel request);
        Task<bool> PromocodeApplicableForUser(
        PromocodeApplicableForUserQueryModel request);
        Task<PaymentResponseModel> GetInvoiceDetails(string paymentId);
        string GetPaymentContactBySongHistoryId(long songHistoryId);
    }
}
