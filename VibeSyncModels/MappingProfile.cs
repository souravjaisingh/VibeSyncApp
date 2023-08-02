using AutoMapper;

namespace VibeSyncModels
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<EntityModels.User, Request_ResponseModels.User>().ReverseMap();
        }
    }
}