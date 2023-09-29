using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetUserId : IRequest<long>
    {
        public string email { get; set; }
    }
}
