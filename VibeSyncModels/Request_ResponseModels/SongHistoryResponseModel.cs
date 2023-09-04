using System;

namespace VibeSyncModels.Request_ResponseModels
{
    /// <summary>
    /// Song History Response Model
    /// </summary>
    public class SongHistoryResponseModel
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public long Id { get; set; }
        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        public long UserId { get; set; }
        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public long EventId { get; set; }
        /// <summary>
        /// Gets or sets the dj identifier.
        /// </summary>
        /// <value>
        /// The dj identifier.
        /// </value>
        public long DjId { get; set; }
        /// <summary>
        /// Gets or sets the name of the song.
        /// </summary>
        /// <value>
        /// The name of the song.
        /// </value>
        public string SongName { get; set; }
        /// <summary>
        /// Gets or sets the song identifier.
        /// </summary>
        /// <value>
        /// The song identifier.
        /// </value>
        public string SongId { get; set; }
        /// <summary>
        /// Gets or sets the song status.
        /// </summary>
        /// <value>
        /// The song status.
        /// </value>
        public string SongStatus { get; set; }
        /// <summary>
        /// Gets or sets the created on.
        /// </summary>
        /// <value>
        /// The created on.
        /// </value>
        public DateTime CreatedOn { get; set; }
        /// <summary>
        /// Gets or sets the created by.
        /// </summary>
        /// <value>
        /// The created by.
        /// </value>
        public string CreatedBy { get; set; }
        /// <summary>
        /// Gets or sets the modified on.
        /// </summary>
        /// <value>
        /// The modified on.
        /// </value>
        public DateTime? ModifiedOn { get; set; }
        /// <summary>
        /// Gets or sets the modified by.
        /// </summary>
        /// <value>
        /// The modified by.
        /// </value>
        public string ModifiedBy { get; set; }
        /// <summary>
        /// Gets or sets the image.
        /// </summary>
        /// <value>
        /// The image.
        /// </value>
        public string Image { get; set; }
        /// <summary>
        /// Gets or sets the artist identifier.
        /// </summary>
        /// <value>
        /// The artist identifier.
        /// </value>
        public string ArtistId { get; set; }
        /// <summary>
        /// Gets or sets the name of the artist.
        /// </summary>
        /// <value>
        /// The name of the artist.
        /// </value>
        public string ArtistName { get; set; }
        /// <summary>
        /// Gets or sets the name of the album.
        /// </summary>
        /// <value>
        /// The name of the album.
        /// </value>
        public string AlbumName { get; set; }
    }
}
