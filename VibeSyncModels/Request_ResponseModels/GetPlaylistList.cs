using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetPlaylistList : IRequest<List<GetPlaylistList>>
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
