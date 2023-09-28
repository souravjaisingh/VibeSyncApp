using AutoMapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class EventCommandRepository : IEventCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;
        /// <summary>
        /// IUserQueryRepository
        /// </summary>
        private readonly IUserQueryRepository _user;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public EventCommandRepository(IDBContextFactory context, IMapper mapper, IUserQueryRepository user)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
            _user = user;
        }

        /// <summary>
        /// Creates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public async Task<long> CreateEvent(EventsDetails request)
        {
            var djId = _user.GetDjByUserId(request.UserId);
            request.DjId = djId;
            var eventDetails = _mapper.Map<Event>(request);
            eventDetails.CreatedBy = request.UserId.ToString();
            eventDetails.CreatedOn = DateTime.Now;
            _context.Events.Add(eventDetails);
            var response = await _context.SaveChangesAsync();
            if (response > 0)
                return Convert.ToInt64(eventDetails.Id);
            else
                throw new CustomException(Constants.DbOperationFailed);
        }

        /// <summary>
        /// Updates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        /// <exception cref="VibeSyncModels.CustomException"></exception>
        public async Task<EventsDetails> UpdateEvent(EventsDetails request)
        {
            var eventEntity = _context.Events.Where(x => x.Id == request.Id).FirstOrDefault();
            if (eventEntity != null)
            {
                eventEntity.Longitude = request.Longitude;
                eventEntity.Latitude = request.Latitude;
                eventEntity.ModifiedOn = DateTime.Now;
                eventEntity.ModifiedBy = request.UserId.ToString();
                eventEntity.Venue = request.Venue;
                eventEntity.EventName = request.EventName;
                eventEntity.EventEndDateTime = request.EventEndDateTime;
                eventEntity.EventStartDateTime = request.EventStartDateTime;
                eventEntity.EventDescription = request.EventDescription;
                eventEntity.EventGenre = request.EventGenre;
                eventEntity.EventStatus = request.EventStatus;
                eventEntity.MinimumBid = request.MinimumBid;
                _context.Events.Update(eventEntity);
                // Save changes to the database
                var response = await _context.SaveChangesAsync();

                if (response > 0)
                {
                    return request;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
            else
            {
                throw new CustomException("Entity not found");
            }
        }
    }
}
