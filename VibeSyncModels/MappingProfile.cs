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
            CreateMap<EventsDetails, Event>().ReverseMap();
            CreateMap<UpdateDjCommandModel, Dj>().ReverseMap();
            CreateMap<Dj, DjProfileResponseModel>().ReverseMap();
            CreateMap<PersistSongHistoryPaymentRequest, SongHistory>()
                .ForMember(dest => dest.Image, src => src.MapFrom(prop => prop.AlbumImage));
        }
    }
}