using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;
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
                           ModifiedOn = e.ModifiedOn
                       }).ToList().AsEnumerable();
            return Task.FromResult(response);
        }
    }
}
