using System;
using System.Collections.Generic;
using System.Linq;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Helpers;
using VibeSyncModels;
using VibeSyncModels.Enums;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// EventQueryRepository
    /// </summary>
    public class EventQueryRepository : IEventQueryRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserQueryRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public EventQueryRepository(IDBContextFactory context)
        {
            _context = context.GetDBContext();
        }

        /// <summary>
        /// Gets the events by dj identifier.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public List<EventsDetails> GetEventsByDjId(GetEventsByUserId request)
        {
            var events = _context.Events.Join(
                _context.Djs.Where(d => d.UserId == request.UserId)
                , events => events.DjId
                , dj => dj.Id,
                (events, dj) => new EventsDetails
                {
                    Id = events.Id,
                    DjId = events.DjId,
                    DjDescription = dj.DjDescription,
                    DjPhoto = dj.DjPhoto,
                    DjName = dj.DjName,
                    DjGenre = dj.DjGenre,
                    EventDescription = events.EventDescription,
                    EventEndDateTime = events.EventEndDateTime,
                    EventStartDateTime = events.EventStartDateTime,
                    EventGenre = events.EventGenre,
                    EventName = events.EventName,
                    EventStatus = events.EventStatus,
                    Latitude = events.Latitude,
                    Longitude = events.Longitude,
                    MinimumBid = events.MinimumBid,
                    Venue = events.Venue,
                    CreatedBy = events.CreatedBy,
                    CreatedOn = events.CreatedOn,
                    AcceptingRequests = events.AcceptingRequests,
                    DisplayRequests = events.DisplayRequests,
                    Playlists = events.Playlists,
                    HidePlaylist = events.HidePlaylist,
                    MinimumBidForSpecialRequest = events.MinimumBidForSpecialRequest   
                }
                ).Where(x=> x.EventStatus != Constants.EventDeleted)
                .OrderBy(x => x.EventStatus).ThenByDescending(res => res.CreatedOn).ToList();
            return events;
        }

        /// <summary>
        /// Gets the events with dj information.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<EventsDetails> GetEventsWithDjInfo()
        {
            var response = (from e in _context.Events
                            join d in _context.Djs
                            on e.DjId equals d.Id
                            select new EventsDetails()
                            {
                                Id = e.Id,
                                DjId = e.DjId,
                                DjDescription = d.DjDescription,
                                DjGenre = d.DjGenre,
                                DjName = d.DjName,
                                DjPhoto = d.DjPhoto,
                                EventDescription = e.EventDescription,
                                EventGenre = e.EventGenre,
                                EventEndDateTime = e.EventEndDateTime,
                                EventStartDateTime = e.EventStartDateTime,
                                EventName = e.EventName,
                                EventStatus = e.EventStatus,
                                MinimumBid = e.MinimumBid,
                                Venue = e.Venue,
                                CreatedBy = e.CreatedBy,
                                CreatedOn = e.CreatedOn,
                                ModifiedBy = e.ModifiedBy,
                                ModifiedOn = e.ModifiedOn,
                                Latitude = e.Latitude,
                                Longitude = e.Longitude,
                                AcceptingRequests = e.AcceptingRequests,
                                DisplayRequests = e.DisplayRequests,
                                HidePlaylist = e.HidePlaylist,
                                MinimumBidForSpecialRequest = e.MinimumBidForSpecialRequest,
                                Playlists = e.Playlists
                            }).Where(x=> x.EventStatus != Constants.EventDeleted)
                            .ToList().AsEnumerable();
            return response;
        }

        /// <summary>
        /// Gets the live events.
        /// </summary>
        /// <param name="latitude">The latitude.</param>
        /// <param name="longitude">The longitude.</param>
        /// <returns></returns>
        public IEnumerable<EventsDetails> GetLiveEvents(double latitude, double longitude)
        {
            var response = (from e in _context.Events
                            join d in _context.Djs
                            on e.DjId equals d.Id
                            select new EventsDetails()
                            {
                                Id = e.Id,
                                DjId = e.DjId,
                                DjDescription = d.DjDescription,
                                DjGenre = d.DjGenre,
                                DjName = d.DjName,
                                DjPhoto = d.DjPhoto,
                                EventDescription = e.EventDescription,
                                EventGenre = e.EventGenre,
                                EventEndDateTime = e.EventEndDateTime,
                                EventStartDateTime = e.EventStartDateTime,
                                EventName = e.EventName,
                                EventStatus = e.EventStatus,
                                MinimumBid = e.MinimumBid,
                                Venue = e.Venue,
                                CreatedBy = e.CreatedBy,
                                CreatedOn = e.CreatedOn,
                                ModifiedBy = e.ModifiedBy,
                                ModifiedOn = e.ModifiedOn,
                                Latitude = e.Latitude,
                                Longitude = e.Longitude,
                                AcceptingRequests = e.AcceptingRequests,
                                DisplayRequests = e.DisplayRequests,
                                Playlists = e.Playlists,
                                HidePlaylist = e.HidePlaylist,
                                MinimumBidForSpecialRequest = e.MinimumBidForSpecialRequest
                            }).Where(x => x.EventStatus == Constants.Live && x.EventStatus != Constants.EventDeleted).ToList();
            for (int i = 0; i < response.Count; i++)
            {
                response[i].DistanceFromCurrLoc = (decimal?)HaversineDistance(
                                        new Coordinates(latitude, longitude),
                                        new Coordinates((double)response[i].Latitude, (double)response[i].Longitude),
                                        DistanceUnit.Miles);
            }
            var sortedEvents = response.OrderBy(x => x.DistanceFromCurrLoc).ToList().AsEnumerable();
            return sortedEvents;
        }

        /// <summary>
        /// Haversines the distance.
        /// </summary>
        /// <param name="pos1">The pos1.</param>
        /// <param name="pos2">The pos2.</param>
        /// <param name="unit">The unit.</param>
        /// <returns></returns>
        public double HaversineDistance(Coordinates pos1, Coordinates pos2, DistanceUnit unit)
        {
            double R = (unit == DistanceUnit.Miles) ? 3960 : 6371;
            var lat = (pos2.Latitude - pos1.Latitude).ToRadians();
            var lng = (pos2.Longitude - pos1.Longitude).ToRadians();
            var h1 = Math.Sin(lat / 2) * Math.Sin(lat / 2) +
                          Math.Cos(pos1.Latitude.ToRadians()) * Math.Cos(pos2.Latitude.ToRadians()) *
                          Math.Sin(lng / 2) * Math.Sin(lng / 2);
            var h2 = 2 * Math.Asin(Math.Min(1, Math.Sqrt(h1)));
            return R * h2;
        }

        /// <summary>
        /// Gets the events by dj identifier.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public EventsDetails GetEventsByEventId(GetEventsByEventId request)
        {
            if(request.UserId > 0)
            {
                return _context.Events
                .Join(
                    _context.Djs.Where(d => d.UserId == request.UserId),
                    e => e.DjId,
                    d => d.Id,
                    (e, d) => new EventsDetails
                    {
                        Id = e.Id,
                        DjId = e.DjId,
                        DjDescription = d.DjDescription,
                        DjPhoto = d.DjPhoto,
                        DjName = d.DjName,
                        DjGenre = d.DjGenre,
                        EventDescription = e.EventDescription,
                        EventEndDateTime = e.EventEndDateTime,
                        EventStartDateTime = e.EventStartDateTime,
                        EventGenre = e.EventGenre,
                        EventName = e.EventName,
                        EventStatus = e.EventStatus,
                        Latitude = e.Latitude,
                        Longitude = e.Longitude,
                        MinimumBid = e.MinimumBid,
                        Venue = e.Venue,
                        CreatedBy = e.CreatedBy,
                        CreatedOn = e.CreatedOn,
                        AcceptingRequests = e.AcceptingRequests,
                        DisplayRequests = e.DisplayRequests,
                        Playlists = e.Playlists,
                        HidePlaylist = e.HidePlaylist,
                        MinimumBidForSpecialRequest= e.MinimumBidForSpecialRequest
                    }
                )
                .Where(e => e.Id == request.EventId)
                .FirstOrDefault();
            }
            else
            {
                // Step 1: Retrieve the DjId from the Events table
                var djId = _context.Events
                    .Where(e => e.Id == request.EventId)
                    .Select(e => e.DjId)
                    .FirstOrDefault();

                // Step 2: Use the retrieved DjId to join with the Djs table
                var eventsDetails = _context.Events
                    .Where(e => e.Id == request.EventId)
                    .Join(
                        _context.Djs,
                        e => e.DjId,
                        d => d.Id,
                        (e, d) => new EventsDetails
                        {
                            Id = e.Id,
                            DjId = e.DjId,
                            DjDescription = d.DjDescription,
                            DjPhoto = d.DjPhoto,
                            DjName = d.DjName,
                            DjGenre = d.DjGenre,
                            EventDescription = e.EventDescription,
                            EventEndDateTime = e.EventEndDateTime,
                            EventStartDateTime = e.EventStartDateTime,
                            EventGenre = e.EventGenre,
                            EventName = e.EventName,
                            EventStatus = e.EventStatus,
                            Latitude = e.Latitude,
                            Longitude = e.Longitude,
                            MinimumBid = e.MinimumBid,
                            Venue = e.Venue,
                            CreatedBy = e.CreatedBy,
                            CreatedOn = e.CreatedOn,
                            AcceptingRequests = e.AcceptingRequests,
                            DisplayRequests = e.DisplayRequests,
                            Playlists   = e.Playlists,
                            HidePlaylist = e.HidePlaylist,
                            MinimumBidForSpecialRequest = e.MinimumBidForSpecialRequest
                        }
                    )
                    .FirstOrDefault();

                return eventsDetails;
            }
        }

        public bool DeleteEvent(DeleteEvent request)
        {
            var res = _context.Events.FirstOrDefault(x => x.Id == request.EventId);
            res.EventStatus = Constants.EventDeleted;
            return _context.SaveChanges() > 0 ? true : false;
            
        }
    }
}
