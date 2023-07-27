using AutoMapper;

namespace VibeSyncApp
{
    internal class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<VibeSync.DAL.Models.User, Models.User>();
        }
    }
}