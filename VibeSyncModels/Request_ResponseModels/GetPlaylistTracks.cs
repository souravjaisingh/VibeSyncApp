using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetPlaylistTracks : IRequest<List<SongDetails>>
    {
        public string Id { get; set; }
        public int Offset { get; set; }
        public int Limit { get; set; }
    }
}
