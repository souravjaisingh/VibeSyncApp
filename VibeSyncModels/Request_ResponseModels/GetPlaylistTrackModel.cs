using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class SpotifyPlaylistTrackModel
    {
        public Track Track { get; set; }

    }
    public class Track
    {
        public Album Album { get; set; }
        public List<Artist> artists { get; set; }
        public string id { get; set; }
        public string name { get; set; }
    }
}
