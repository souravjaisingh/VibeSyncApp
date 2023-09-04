using AutoMapper;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncModels
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<EntityModels.User, Request_ResponseModels.User>().ReverseMap();
            CreateMap<SongHistory, SongHistoryResponseModel>().ReverseMap();
        }
    }
}