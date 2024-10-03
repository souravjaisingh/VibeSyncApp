using AutoMapper;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using VibeSync.DAL.DBContext;
using System.Threading.Tasks;
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

        public async Task<GetDjTransactionsSummary> GetDjTransactionSummary(GetDjTransactionsInfoRequest request)
        {
            GetDjTransactionsSummary res = new GetDjTransactionsSummary();

            res.TotalAmount =  (from payment in _context.Payments
                                                    where (from songHistory in _context.SongHistories
                                                           where songHistory.DjId == request.DjId && songHistory.SongStatus == "Played"
                                                           select songHistory.Id).ToList()
                                                           .Contains((long)payment.SongHistoryId)
                                                    select payment.TotalAmount).Sum();

            var eventIds = await _context.Events.Where(x => x.DjId == request.DjId).Select(y => y.Id).ToListAsync();

            foreach (var eventId in eventIds)
            {
                res.RemainingAmount += await _context.Settlements
                    .Where(x => x.EventId == eventId)
                    .OrderByDescending(x => x.Id)
                    .Select(y => y.RemainingAmount).FirstOrDefaultAsync();
            }

            res.SettledAmount = res.TotalAmount - res.RemainingAmount;

            return res;

        }

        public async Task<IEnumerable<GetReviewResponseModel>> GetReviews(GetReviewRequestModel request)
        {
            return await _context.Reviews.Select(review => new GetReviewResponseModel
            {
                Id = review.Id,
                DjId = review.DjId,
                EventId = review.EventId,
                Review1 = review.Review1,
                Star = review.Star,
                CreatedBy = review.CreatedBy
            })
        .ToArrayAsync();

        }
    }
}
