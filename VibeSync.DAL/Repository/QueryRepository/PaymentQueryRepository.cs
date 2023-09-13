using Microsoft.Extensions.Configuration;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
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
        public PaymentQueryRepository(IPaymentCommandRepository paymentCommand
            ,IUserQueryRepository user)
        {
            _paymentCommand = paymentCommand;
            _user = user;
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
