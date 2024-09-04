using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class LoginDetails : IRequest<LoginDetails>
    {
        public long Id { get; set; }
        public bool IsUser { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public long? DjId { get; set; }
    }
}
