using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    /// <summary>
    /// SongDetails
    /// </summary>
    public class SongDetails
    {
        /// <summary>
        /// Gets or sets the album.
        /// </summary>
        /// <value>
        /// The album.
        /// </value>
        public Album Album { get; set; }
        /// <summary>
        /// Gets or sets the artists.
        /// </summary>
        /// <value>
        /// The artists.
        /// </value>
        public Artists Artists { get; set; }
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
        public List<Image> Image { get; set; }
        public string Language { get; set; }

    }
    /// <summary>
    /// Album
    /// </summary>
    public class Album
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }
        //commented Spotify response
        //public List<Image> Images { get; set; }
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
    }
    public class Artist
    {
        public string Id { get; set; }
        public string Name { get; set; }

    }
    /// <summary>
    /// Artist
    /// </summary>
    public class Artists
    {
        public List<Artist> Primary { get; set; }
    }
    /// <summary>
    /// Image
    /// </summary>
    public class Image
    {
        /// <summary>
        /// Gets or sets the quality.
        /// </summary>
        /// <value>
        /// The quality.
        /// </value>
        public string Quality { get; set; }

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; }
        //commented Spotify response
        /*        /// <summary>
                /// Gets or sets the height.
                /// </summary>
                /// <value>
                /// The height.
                /// </value>
                public int Height { get; set; }
                /// <summary>
                /// Gets or sets the URL.
                /// </summary>
                /// <value>
                /// The URL.
                /// </value>
                public string Url { get; set; }
                /// <summary>
                /// Gets or sets the width.
                /// </summary>
                /// <value>
                /// The width.
                /// </value>
                public int Width { get; set; }*/
    }
}
