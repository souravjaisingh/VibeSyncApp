using AutoMapper;
using System;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;
using VibeSyncModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class DjCommandRepository : IDjCommandRepository
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
        public DjCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
        }
        /// <summary>
        /// Updates the dj.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        /// <exception cref="VibeSyncModels.CustomException"></exception>
        public async Task<string> UpdateDj(UpdateDjCommandModel request)
        {
            var djDetails = _mapper.Map<Dj>(request);
            request.ModifiedOn = DateTime.Now;
            _context.Djs.Update(djDetails);
            var response = await _context.SaveChangesAsync();
            if (response > 0)
                return request.Id.ToString();
            else
                throw new CustomException(Constants.DbOperationFailed);
        }
    }
}
