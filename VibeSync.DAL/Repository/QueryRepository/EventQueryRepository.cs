using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Helpers;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// EventQueryRepository
    /// </summary>
    public class EventQueryRepository : IEventQueryRepository
    {
        /// <summary>
        /// The database context
        /// </summary>
        private readonly IDBContextFactory _dbContext;
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
            _dbContext = context;
            _context = _dbContext.GetDBContext();
        }

        public Task<IEnumerable<EventsResponse>> GetEventsWithDjInfo()
        {
            var response = (from e in _context.Events
                            join d in _context.Djs
                            on e.DjId equals d.Id
                            select new EventsResponse()
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
                                Longitude = e.Longitude
                            }).ToList().AsEnumerable();
            return Task.FromResult(response);
        }

        public Task<IEnumerable<EventsResponse>> GetLiveEvents(double latitude, double longitude)
        {
            var response = (from e in _context.Events
                            join d in _context.Djs
                            on e.DjId equals d.Id
                            select new EventsResponse()
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
                                Longitude = e.Longitude
                            }).ToList();
            for (int i = 0; i < response.Count; i++)
            {
                response[i].DistanceFromCurrLoc = (decimal?)HaversineDistance(
                                        new Coordinates(latitude, longitude),
                                        new Coordinates((double)response[i].Latitude, (double)response[i].Longitude),
                                        DistanceUnit.Miles);
            }
            var sortedEvents = response.OrderBy(x => x.DistanceFromCurrLoc).ToList().AsEnumerable();
            return Task.FromResult(sortedEvents);
        }

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

        public enum DistanceUnit { Miles, Kilometers };
    }
}
