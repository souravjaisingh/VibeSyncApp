using AutoMapper;
using MediatR;
using Microsoft.Extensions.Configuration;
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
        IRequestHandler<GetSongHistoryRequestModel, List<SongHistoryModel>>, IRequestHandler<SongHistoryModel, string>, IRequestHandler<GetPlaylistList, List<GetPlaylistList>>, IRequestHandler<GetPlaylistTracks, List<SongDetails>>
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
        private string BaseUrl { get; set; }
        /// <summary>
        /// Gets or sets the query parameters.
        /// </summary>
        /// <value>
        /// The query parameters.
        /// </value>
        private string QueryParameters { get; set; }
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

        /// <summary>
        /// Initializes a new instance of the <see cref="SongsHandler"/> class.
        /// </summary>
        /// <param name="client">The client.</param>
        public SongsHandler(HttpClient client, ISongQueryRepository songQueryRepository, IMapper mapper, ISongCommandRepository songCommandRepository)
        {
            _httpClient = client;

            var builder = new ConfigurationBuilder().
                SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json");
            var configuration = builder.Build();
            AccessTokenUrl = configuration["SpotifyApi:AccessTokenUrl"];
            ClientSecret = configuration["SpotifyApi:ClientSecret"];
            ClientId = configuration["SpotifyApi:ClientId"];
            BaseUrl = configuration["SpotifyApi:BaseUrl"];
            QueryParameters = configuration["SpotifyApi:TrackSearch"];
            GetPlaylists = configuration["SpotifyApi:GetPlaylists"];
            GetPlaylistTracks = configuration["SpotifyApi:GetPlaylistTracks"];
            _songQueryRepository = songQueryRepository;
            _mapper = mapper;
            _songCommandRepository = songCommandRepository;
        }
        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<SongDetails>> Handle(GetSongRequestModel request, CancellationToken cancellationToken)
        {
            var accessToken = await GetSpotifyAccessToken();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            string queryParameters = string.Format(QueryParameters, request.SongName, request.Offset, request.limit);

            var response = await _httpClient.GetAsync($"{BaseUrl}{queryParameters}");
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonObject = JObject.Parse(responseContent);
            var items = jsonObject["tracks"]["items"].ToString();
            var songDetails = JsonConvert.DeserializeObject<List<SongDetails>>(items);
            return songDetails;
        }

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
            if (request.EventId > 0)
            {
                var songHistory = _songQueryRepository.GetSongHistoryByEventId(request.EventId, request.IsUser);
                return await Task.Run(() => _mapper.Map<List<SongHistoryModel>>(songHistory));
            }
            else
            {
                return _songQueryRepository.GetSongHistoryByUserId(request.UserId, request.SongStatus);
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

            var response = await _httpClient.GetAsync($"{BaseUrl}{GetPlaylists}");
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

            var response = await _httpClient.GetAsync($"{BaseUrl}{url}");
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
