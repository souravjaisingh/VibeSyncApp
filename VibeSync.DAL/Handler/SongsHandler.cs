using AutoMapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    /// <summary>
    /// Songs Handler
    /// </summary>
    /// <seealso cref="MediatR.IRequestHandler&lt;VibeSyncModels.Request_ResponseModels.GetSongRequestModel, VibeSyncModels.Request_ResponseModels.SongDetails&gt;" />
    public class SongsHandler : IRequestHandler<GetSongRequestModel, List<SongDetails>>,
        IRequestHandler<GetSongHistoryRequestModel, List<SongHistoryModel>>,
        IRequestHandler<SongHistoryModel, string>,
        IRequestHandler<GetPlaylistList, List<GetPlaylistList>>,
        IRequestHandler<GetPlaylistTracks, List<SongDetails>>
    {
        /// <summary>
        /// Gets or sets the song query repository.
        /// </summary>
        /// <value>
        /// The song query repository.
        /// </value>
        private readonly ISongQueryRepository _songQueryRepository;
        /// <summary>
        /// The song command repository
        /// </summary>
        private readonly ISongCommandRepository _songCommandRepository;
        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;
        /// <summary>
        /// The HTTP client
        /// </summary>
        private readonly HttpClient _httpClient;
        /// <summary>
        /// Gets or sets the base URL.
        /// </summary>
        /// <value>
        /// The base URL.
        /// </value>
        private string SpotifyBaseUrl { get; set; }
        private string JioSaavanBaseUrl { get; set; }

        /// <summary>
        /// Gets or sets the query parameters.
        /// </summary>
        /// <value>
        /// The query parameters.
        /// </value>
        private string JioSaavanQueryParameters { get; set; }
        private string GetPlaylists { get; set; }
        private string GetPlaylistTracks { get; set; }

        /// <summary>
        /// Gets or sets the client identifier.
        /// </summary>
        /// <value>
        /// The client identifier.
        /// </value>
        private string ClientId { get; set; }
        /// <summary>
        /// Gets or sets the client secret.
        /// </summary>
        /// <value>
        /// The client secret.
        /// </value>
        private string ClientSecret { get; set; }
        /// <summary>
        /// Gets or sets the access token URL.
        /// </summary>
        /// <value>
        /// The access token URL.
        /// </value>
        private string AccessTokenUrl { get; set; }
        private string SpotifyTrackSearchParams { get; set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="SongsHandler"/> class.
        /// </summary>
        /// <param name="client">The client.</param>

        #region
        //Songs to be filtered out
        public string[] HaryanviSongs = { "52 GAJ KA DAMAN", "Chatak Matak", "COCO COLA", "Sandal", "Bahu Kale Ki", "Moto", "Left Right", " JUG JUG JEEVE", "Laad Piya Ke", "LALA LORI", "Father Saab", "Teri Aakhya Ka Yo Kajal", "Razzi Bolja", "4G Ka Jamana", "Gurjar Ka Kharcha", "Gypsy", " LOOT LIYA", "Ghunghat Bain", "Badli Badli Laage", "English Medium", "Mulakaat", " Teri Lat Lag Jagi", "UNCHI HAVELI", " Mera Chand", " Yaar Ki Shaadi", "SOLID BODY", "Bholenath", "4G Ka Jamana", "Desi Desi Na Bolya Kar Chori Re", "Mithi Boli", "Matak Chalungi", " Ghungroo Toot Jayega", "Halka Dupatta Tera Muh Dikhe", "Lilo Chaman", "Ghagra", "Thada Bhartar", "Jalebi Juda", " GodFather", " Middle Class", "Goli Chal Javegi", "Nazar", " TORA", "Bawli Tared", "Chhutti", "Pistal Te Mehnga Lehnga", "Laada Ka Lada", "Bhagatt Aadmi Tha", "Gunehgar", "Mouj Jamane Main", "Sapna Chaudhary", "Sapna Choudhary", "52 GAJ" };
        public string[] BhojpuriSongs = { "Palang Sagwan Ke", "Maroon Color Sadiya", "Kamariya Dole", "RajaJi Ke Dilwa", "Chhalakata Hamro Jawaniya", "Bas Kar Pagli", "Hook Raja Ji", "Aam Ke Swad", "Mere Marad Mahoday Ji", "Hari Hari Odhani", "Heroine", "Sadiya Bulukiya", "Laal Ghaghra", "Shila Hau Ka", "Baarish Ban Jaana", "Saree Se Tadi", "Laundiya London Se Layenge", "Pagal Banaibu Kare Patar Ki", "Saj Ke Sawar Ke", "Apne Lover Ko Dhokha Do", "Kalkatiya Raja", "Raate Diya Buta Ke Piya Kya Kya Kiya", "Nimbu Kharbuja Bhail 2", "Panche Ke Nache Aiha", "Heek Bhar Nihare Da", "Ae Raja Hamke Banaras Ghumai Da", "Leke Sinhorwa Me", "Dhani Ho Sab Dhan", "Piya Ji Ke Muski", "Chhuye Ke Chhod Di", "Bewfa Tune Tune Pyar Me Badnam Kar Dala", "Tikuliya Ae Raja", "Pyar Mein Naikhi Gori Hum Bewafa", "Aego Baat Batai", "Godi Me Leke", "Paro", "Nathuniya", "Zindagi", "Nadiya Bich Naiya Dole", "Dugo Rakhale Bani", "Sutaal Tani Kora Mein", "Raja Ji", "Kamariya Lollypop Lagelu", "Bewafa Pyar", "Hariyarki Odhaniya", "Love Kala Sab Hoi", "Piyar Farak Wali", "Raja Ji Khoon Kaida", "Dewara Dhodhi Chatana Ba", "Le Le Aayi Coca Cola", "Gulabi Sharara" };
        public string[] MusicKeywords = { "Unplugged", "Mashup", "Female", "Male", "Remix", "Acoustic", "Cover", "Live", "Instrumental", "Original", "Demo", "Extended", "Edit", "Reissue", "Single", "Compilation", "Demo", "Acapella", "Medley", "Tribute", "Version", "Rework", "Bootleg", "Bootleg", "Dub", "Extended Mix", "Radio Edit", "Club Mix", "Remaster", "Rerelease", "Demo", "EP", "LP", "Full-Length", "Track", "Cut", "Score", "Soundtrack", "Jingle", "Theme", "Cover Version", "Interlude", "Outro", "Intro", "Pre-Release", "Preview", "Split", "Virtual", "Live Session", "Mixtape", "Compilation Album", "Greatest Hits", "B-Side", "Alternative", "Lo-Fi" };
        public string[] bhajans = { "Mere Ghar Ram Aaye Hain", "Meri Maa Ke Barabar Koi Nahi", "shiv stotram", "Shri Krishna Govind Hare Murari", "Mere Baba Song", "Har Har Mahadev", "Mere Bhole Nath", "Om Jai Jagdish Hare Aarti", "Narayan Mil Jayega", "Shiv Tandav", "Hare Krishna Hare Rama", "Hare Krishna Hare", "Main Balak Tu Mata", "Achyutam Keshavam", "Siya Ram", "Govind Bolo Song", "HAR HAR SHAMBHU", "Om Namah Shivay", "Avadh Mein Laute Hai Shri Ram Bhajan", "Hanuman Chalisa", "RAGHUPATI RAGHAV RAJA RAM", "Aaye Ram Mere", "Lal Chunariya", "CHOTO SO MERO MADAN GOPAL", "RAM PADHAARE", "Mera Aapki Kripa Se", "RAM JI KA NAAM", "Aala Re Aala Ganesha", "BAM BAM BHOLE", "Shriman Narayan Hari Hari", "Mahamrityunjaya Mantra", "Jai Jai Radha Raman Hari Bol", "Ram Naam Se Jagmag Hai", "Mere Sai", "Mourya Re", "AALA RE AALA GANESHA", "Mere Kanha Bhool Na Jaana" };
        public string[] haryanviArtistNames = { "Sapna Chaudhary", "Sapna Choudhary", "Anjali Raghav", "Raju Punjabi", "Masoom Sharma", "Vicky Kajla", "Ruchika Jangid", "Anu Kadyan", "Sonu Garanpuria", "Rohtash Gaud", "Renuka Panwar", "Pooja Hooda", "Raj Mawar", "Tarun Panchal", "Kavita Joshi", "Avinash Jangid", "Randhir Foji", "Rajesh Singhpuriya", "Naveen Naru", "Pooja Chaudhary", "Jyoti Gill", "Anil Kamalpuriya", "Priyanka Tiwari", "Sonika Singh", "Hina Khan", "Pardeep Boora", "Vikas Siwach", "Anshu Rana", "Sweta Chauhan", "Neha Malik", "Joginder Kundu", "Rakesh Tanwar", "Deepak Boora", "Nitin Kumar", "Sapna Hooda", "Satpal Saini", "Seema Kaushik", "Ritu Soni", "Sonia Sharma", "Divya Chaudhary", "Sunil Saini", "Uday Beniwal", "Yashpal Saini", "Pooja Bedi", "Anil Boora", "Deepak Dhillon", "Rohit Tehlan", "Jyoti Rana", "Dhanda Nyoliwala", "Khasa Aala Chahar", "Shiva Choudhary", "Sheenam Katholic", "Sumit Goswami", "Ashu Twinkle", "Ndee Kundu", "Amanraj Gill", "R Maan", "Anjali 99", "Sumit Parta", "Sandeep Surila", "Harjeet Deewana", "Rahul Puthi", "Diler Kharkiya", "Gulzaar Chhaniwala", "Gajender Phogat", "Surender Romio", "Vishvajeet Choudhary","Inder Arya", "Young uttrakhand Group Inder Arya" };
        public string[] bhojpuriArtistNames = { "Manoj Tiwari", "Pawan Singh", "Khesari Lal Yadav", "Dinesh Lal Yadav", "Pravesh Lal Yadav", "Bharat Sharma Vyas", "Udit Narayan", "Gopal Rai", "Guddu Rangeela", "Ajeet Anand", "Badal Bawli", "Mohan Rathore", "Alok Kumar", "Arvind Akela (Kallu)", "Chotu Chaliya", "Diwakar Drivedy", "Madan Rai", "Radhe Shyam Rasiya", "Ram Pyare Rajaki", "Young Storm", "Various", "Vishnu Ojha", "Ajay Pandey", "Banarasi Slave", "Chotu Bihari", "Chintamani", "Dinesh Sharma", "Farida Mir", "Govind Ojha", "Indel Unique", "Jairaj Singh", "Shani Kumar Sania", "Balram Yadav", "Kamlesh Nagar", "Rakesh Mishra", "Ashok Mishra", "Alok Raj Karimana", "Amit Yadav", "Jay Pandey", "Laddu Deewana", "Madhava Rai", "Manoj Kumar", "Mithu Marshall", "Tarabano Faizabadi", "Sharda Sinha", "Geeta Rani", "Anjali Jain", "Playful Chances", "Khushboo Jain", "Indu Sonali", "Paro Rani", "Khushboo Raj", "Anuradha Paudwal", "Goddess", "Shreya Ghoshal", "Kalpana Patowari", "Mamta Rawat", "Anamika Singh", "Nisha Dubey", "Shilpi Raj" };


        #endregion

        public SongsHandler(HttpClient client, ISongQueryRepository songQueryRepository, IMapper mapper, ISongCommandRepository songCommandRepository, IConfiguration configuration)
        {
            _httpClient = client;
            AccessTokenUrl = configuration["SpotifyApi:AccessTokenUrl"];
            ClientSecret = configuration["SpotifyApi:ClientSecret"];
            ClientId = configuration["SpotifyApi:ClientId"];
            SpotifyBaseUrl = configuration["SpotifyApi:BaseUrl"];
            JioSaavanQueryParameters = configuration["JioSaavanApi:QueryParams"];
            JioSaavanBaseUrl = configuration["JioSaavanApi:BaseUrl"];
            GetPlaylists = configuration["SpotifyApi:GetPlaylists"];
            GetPlaylistTracks = configuration["SpotifyApi:GetPlaylistTracks"];
            _songQueryRepository = songQueryRepository;
            _mapper = mapper;
            _songCommandRepository = songCommandRepository;
            SpotifyTrackSearchParams = configuration["SpotifyApi:TrackSearch"];
        }
        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<SongDetails>> Handle(GetSongRequestModel request, CancellationToken cancellationToken)
        {
            string queryParameters = string.Format(JioSaavanQueryParameters, request.SongName, request.limit, request.Offset);
            List<SongDetails> songDetails = null;
            int maxRetryAttempts = 1;
            int retryAttempt = 0;

            while (retryAttempt <= maxRetryAttempts)
            {
                try
                {
                    var response = await _httpClient.GetAsync($"{JioSaavanBaseUrl}{queryParameters}");
                    response.EnsureSuccessStatusCode();
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(responseContent);
                    var items = jsonObject["data"]["results"].ToString();
                    songDetails = JsonConvert.DeserializeObject<List<SongDetails>>(items);
                    var language = new List<string> { "english", "hindi", "punjabi" };
                    songDetails.Where(x => language.Contains(x.Language) && x.PlayCount != null && x.PlayCount > 50000);
                    break; // Break out of the loop if successful
                }
                catch (HttpRequestException ex) when (ex.StatusCode != System.Net.HttpStatusCode.OK && ex.StatusCode != System.Net.HttpStatusCode.NoContent)
                {
                    retryAttempt++;
                    if (retryAttempt > maxRetryAttempts)
                    {
                        var accessToken = await GetSpotifyAccessToken();
                        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                        queryParameters = string.Format(SpotifyTrackSearchParams, request.SongName, request.Offset, request.limit);

                        var response = await _httpClient.GetAsync($"{SpotifyBaseUrl}{queryParameters}");
                        response.EnsureSuccessStatusCode();
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var jsonObject = JObject.Parse(responseContent);
                        var items = jsonObject["tracks"]["items"] as JArray;
                        songDetails = new List<SongDetails>();
                        // Map Spotify response to SongDetails using a for loop
                        for (int i = 0; i < items.Count; i++)
                        {
                            bool addSong = true;
                            JObject item = items[i] as JObject; // Safely cast to JObject

                            if (item != null)
                            {
                                // Map Artists
                                var artistList = new List<Artist>();
                                var artistsArray = item["artists"] as JArray;
                                if (artistsArray != null)
                                {
                                    for (int k = 0; k < artistsArray.Count; k++)
                                    {
                                        var artist = artistsArray[k] as JObject; // Safely cast to JObject
                                        if (artist != null && !string.IsNullOrWhiteSpace(artist["name"]?.ToString()) && !haryanviArtistNames.Contains(artist["name"]?.ToString(), StringComparer.OrdinalIgnoreCase) && !bhojpuriArtistNames.Contains(artist["name"]?.ToString(), StringComparer.OrdinalIgnoreCase))
                                        {
                                            artistList.Add(new Artist
                                            {
                                                Id = artist["id"]?.ToString(),
                                                Name = artist["name"]?.ToString()
                                            });
                                        }
                                        else
                                        {
                                            addSong = false;
                                            break;
                                        }
                                    }
                                }
                                if (addSong)
                                {
                                    // Map Album
                                    var albumData = item["album"] as JObject; // Safely cast to JObject
                                    Album album = null;

                                    if (albumData != null)
                                    {
                                        album = new Album
                                        {
                                            Id = albumData["id"]?.ToString(),
                                            Name = albumData["name"]?.ToString(),
                                            Images = new List<Image>()
                                        };

                                        // Map Album Images
                                        var imagesArray = albumData["images"] as JArray;
                                        if (imagesArray != null)
                                        {
                                            var image = imagesArray[0] as JObject; // Safely cast to JObject
                                            if (image != null)
                                            {
                                                album.Images.Add(new Image
                                                {
                                                    Url = image["url"]?.ToString()
                                                });
                                            }
                                        }
                                    }

                                    // Create and add SongDetails
                                    songDetails.Add(new SongDetails
                                    {
                                        Id = item.Property("id").Value.ToString(),
                                        Name = item.Property("name").Value.ToString(),
                                        Album = album,
                                        Artists = new Artists { Primary = artistList },
                                        Image = album?.Images, // Using album images if available
                                                               // Add other properties if needed
                                    });
                                }
                            }
                        }
                    }
                }
            }
            /*songDetails = songDetails.Where(x => !MusicKeywords.Any(keyword => x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
                .Where(x => !HaryanviSongs.Contains(x.Name, StringComparer.OrdinalIgnoreCase))
                .Where(x => !BhojpuriSongs.Contains(x.Name, StringComparer.OrdinalIgnoreCase))
                .Where(x => !bhajans.Contains(x.Name, StringComparer.OrdinalIgnoreCase)).ToList();*/
            songDetails = songDetails
                .Where(x => !MusicKeywords.Any(keyword => x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
                .Where(x => !HaryanviSongs.Any(h => x.Name.Contains(h, StringComparison.OrdinalIgnoreCase)))
                .Where(x => !BhojpuriSongs.Any(b => x.Name.Contains(b, StringComparison.OrdinalIgnoreCase)))
                .Where(x => !bhajans.Any(bh => x.Name.Contains(bh, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            return songDetails;
        }
        private List<SongDetails> FilterSongsByLanguage(List<SongDetails> songs, string language)
        {
            return songs.Where(song => song.Language.Equals(language, StringComparison.OrdinalIgnoreCase)).ToList();
        }
        /// Commenting spotify code as shifting from spotify to Jio Saavn
/*        public async Task<List<SongDetails>> Handle(GetSongRequestModel request, CancellationToken cancellationToken)
        {
            var accessToken = await GetSpotifyAccessToken();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            string queryParameters = string.Format(QueryParameters, request.SongName, request.Offset, request.limit);

            var response = await _httpClient.GetAsync($"{SpotifyBaseUrl}{queryParameters}");
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonObject = JObject.Parse(responseContent);
            var items = jsonObject["tracks"]["items"].ToString();
            var songDetails = JsonConvert.DeserializeObject<List<SongDetails>>(items);
            return songDetails;
        }
*/
        /// <summary>
        /// Handles a request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>
        /// Response from the request
        /// </returns>
        public async Task<List<SongHistoryModel>> Handle(GetSongHistoryRequestModel request, CancellationToken cancellationToken)
        {
            if (request.EventId > 0 && !request.IsAllRequest)
            {
                var songHistory = _songQueryRepository.GetSongHistoryByEventId(request.EventId, request.IsUser);
                return await Task.Run(() => _mapper.Map<List<SongHistoryModel>>(songHistory));
            }
            else if (request.EventId == 0 && request.IsAllRequest)
            {
                var songHistory = _songQueryRepository.GetLiveSongRequests_AllEvents(request.EventId, request.IsAllRequest);
                return await Task.Run(() => _mapper.Map<List<SongHistoryModel>>(songHistory));
            }
            else
            {
                return _songQueryRepository.GetSongHistoryByUserId(request.EventId, request.UserId, request.SongStatus, request.IsAllRequest);
            }

        }

        public async Task<string> Handle(SongHistoryModel request, CancellationToken cancellationToken)
        {
            return await _songCommandRepository.UpdateSongHistory(request);
        }

        #region Private methods        
        /// <summary>
        /// Gets the spotify access token.
        /// </summary>
        /// <returns></returns>
        private async Task<string> GetSpotifyAccessToken()
        {
            var requestBody = new FormUrlEncodedContent(new[]
            {
            new KeyValuePair<string, string>("grant_type", "client_credentials"),
            });

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes($"{ClientId}:{ClientSecret}")));

            var response = await _httpClient.PostAsync(AccessTokenUrl, requestBody);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic json = JsonConvert.DeserializeObject(responseContent);
            return json.access_token;
        }
        #endregion

        public async Task<List<GetPlaylistList>> Handle(GetPlaylistList request, CancellationToken cancellationToken)
        {
            var accessToken = await GetSpotifyAccessToken();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.GetAsync($"{SpotifyBaseUrl}{GetPlaylists}");
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonObject = JObject.Parse(responseContent);
            var items = jsonObject["items"].ToString();
            var songDetails = JsonConvert.DeserializeObject<List<GetPlaylistList>>(items);
            return songDetails;
        }

        public async Task<List<SongDetails>> Handle(GetPlaylistTracks request, CancellationToken cancellationToken)
        {
            var accessToken = await GetSpotifyAccessToken();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            string url = string.Format(GetPlaylistTracks, request.Id, request.Offset, request.Limit);

            var response = await _httpClient.GetAsync($"{SpotifyBaseUrl}{url}");
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonObject = JObject.Parse(responseContent);
            var items = jsonObject["items"].ToString();
            var playlistTracks = JsonConvert.DeserializeObject<List<SpotifyPlaylistTrackModel>>(items).Select(x => x.Track);
            var songDetails = _mapper.Map<List<SongDetails>>(playlistTracks);
            return songDetails;
        }


    }
}
