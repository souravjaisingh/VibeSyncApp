using MediatR;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetDjProfileRequestModel: IRequest<DjProfileResponseModel>
    {
        public long UserId { get; set; }
    }
}
