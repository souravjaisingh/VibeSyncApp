namespace VibeSyncModels.Request_ResponseModels
{
    /// <summary>
    /// GetPaymentInitiationDetails
    /// </summary>
    public class GetPaymentInitiationDetails
    {
        public string OrderId { get; set; }
        public long PaymentIdentity { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName
        {
            get
            {
                return FirstName + " " + LastName;
            }
        }
    }
}
