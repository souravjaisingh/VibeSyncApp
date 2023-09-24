using AutoMapper;
using System.Linq;
using VibeSync.DAL.DBContext;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public class DjQueryRepository : IDjQueryRepository
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
        /// Initializes a new instance of the <see cref="UserQueryRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public DjQueryRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
        }

        /// <summary>
        /// Gets the dj profile by user identifier.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public DjProfileResponseModel GetDjProfileByUserId(GetDjProfileRequestModel request)
        {
            var djEntity = _context.Djs.Where(x => x.UserId == request.UserId).FirstOrDefault();
            return _mapper.Map<DjProfileResponseModel>(djEntity);
        }
    }
}
