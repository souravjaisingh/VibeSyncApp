﻿using AutoMapper;
using System;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;
using VibeSyncModels;
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
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public EventCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
        }

        /// <summary>
        /// Creates the event.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public async Task<long> CreateEvent(EventsDetails request)
        {
            var eventDetails = _mapper.Map<Event>(request);
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
            var eventDetails = _mapper.Map<Event>(request);
            request.ModifiedOn = DateTime.Now;
            _context.Events.Update(eventDetails);
            var response = await _context.SaveChangesAsync();
            if (response > 0)
                return request;
            else
                throw new CustomException(Constants.DbOperationFailed);
        }
    }
}