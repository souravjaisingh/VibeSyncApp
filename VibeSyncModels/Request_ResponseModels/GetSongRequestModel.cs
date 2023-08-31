using MediatR;
using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    /// <summary>
    /// GetSongRequestModel
    /// </summary>
    public class GetSongRequestModel : IRequest<List<SongDetails>>
    {
        /// <summary>
        /// Gets or sets the name of the song.
        /// </summary>
        /// <value>
        /// The name of the song.
        /// </value>
        public string SongName { get; set; }
        /// <summary>
        /// Gets or sets the offset.
        /// </summary>
        /// <value>
        /// The offset.
        /// </value>
        public int Offset { get; set; }
        /// <summary>
        /// Gets or sets the limit.
        /// </summary>
        /// <value>
        /// The limit.
        /// </value>
        public int limit { get; set; }
    }
}
