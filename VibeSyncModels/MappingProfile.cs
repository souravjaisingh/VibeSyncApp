﻿using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSyncModels
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<EntityModels.User, LoginDetails>()
                 .ForMember(dest => dest.IsUser, opt => opt.MapFrom(src => src.UserOrDj == "user"))
                 .ReverseMap();
            CreateMap<EntityModels.User, Request_ResponseModels.UserRequestModel>().ReverseMap();
            CreateMap<SongHistory, SongHistoryModel>()
            .ForMember(dest => dest.PaymentId, opt => opt.MapFrom(src => src.Payments.FirstOrDefault().PaymentId))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.Payments.FirstOrDefault().TotalAmount))
            .ForMember(dest => dest.PaymentDateTime, opt => opt.MapFrom(src => src.Payments.FirstOrDefault().CreatedOn));
            CreateMap<EventsDetails, Event>().ReverseMap();
            CreateMap<UpdateDjCommandModel, Dj>().ReverseMap();
            CreateMap<Dj, DjProfileResponseModel>().ReverseMap();
            CreateMap<Track, SongDetails>()
                .ForMember(dest => dest.Artists, opt => opt.MapFrom(src => new Artists { Primary = src.artists }))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src =>new List<Image> { src.Album.Images.FirstOrDefault()})).ReverseMap();
            CreateMap<Settlement, SettlementResponse>().ReverseMap();
            CreateMap<ReviewDetails, Review>().ReverseMap();
            CreateMap<PersistSongHistoryPaymentRequest, SongHistory>()
                .ForMember(dest => dest.Image, src => src.MapFrom(prop => prop.AlbumImage));
        }
    }
}