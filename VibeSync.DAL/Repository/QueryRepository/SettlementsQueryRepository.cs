using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public class SettlementsQueryRepository : ISettlementsQueryRepository
    {
        private readonly VibeSyncContext _context;
        private readonly IMapper _mapper;

        /// <summary>
        /// The HTTP context accessor
        /// </summary>
        private readonly IHttpContextAccessor _httpContextAccessor;
        public SettlementsQueryRepository(
            IDBContextFactory context,
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper)
        {
       
            _context = context.GetDBContext();
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
          
        }

        public async Task<SettlementResponseModel> GetSettlementByUserId(SettlementRequestModel request)
        {
            var query = from s in _context.Settlements
                        join e in _context.Events on s.EventId equals e.Id
                        join dj in _context.Djs on e.DjId equals dj.Id
                        join u in _context.Users on dj.UserId equals u.Id
                        where u.Id == request.UserId
                        select new SettlementEventResponseModel
                        {
                            EventId = s.EventId,
                            EventName = e.EventName,
                            EventDescription = e.EventDescription,
                            EventStartDatetime = e.EventStartDateTime,
                            EventEndDatetime = e.EventEndDateTime,
                            MinimumBid = e.MinimumBid,
                            Amount = s.Amount,
                            RemainingAmount = s.RemainingAmount,
                            DateCreated = s.DateCreated
                        };

            if (!string.IsNullOrEmpty(request.EventName))
            {
                query = query.Where(q => q.EventName.Contains(request.EventName));
            }

            var totalRows = await query.CountAsync();

            var result = await query
                                .Skip((request.PageNumber - 1) * request.PageSize)
                                .Take(request.PageSize)
                                .ToListAsync();

            var response = new SettlementResponseModel
            {
                Data = result,
                TotalRows = totalRows
            };
            return response;
        }

        public Task<SettlementResponse> GetSettlementDataByEventId(GetSettlementsDataByEventId request)
        {
            var songStatus = "Played";

            var totalAmount = _context.SongHistories
                .Join(
                    _context.Payments,
                    sh => sh.Id,
                    p => p.SongHistoryId,
                    (sh, p) => new { SongHistory = sh, Payment = p }
                )
                .Where(joinResult => joinResult.SongHistory.EventId == request.EventId && joinResult.SongHistory.SongStatus == songStatus)
                .GroupBy(joinResult => new { joinResult.SongHistory.EventId, joinResult.SongHistory.SongStatus })
                .Select(group => group.Sum(joinResult => joinResult.Payment.TotalAmount)).FirstOrDefault();

            var settlement = _mapper.Map<SettlementResponse>(_context.Settlements.OrderByDescending(x => x.Id).FirstOrDefault(x => x.EventId == request.EventId));
            if(totalAmount != null)
            {
                if (settlement != null)
                {
                    settlement.SettledAmount = (decimal)(totalAmount - settlement.RemainingAmount);
                }

                if (settlement == null)
                {
                    settlement = new SettlementResponse();
                    settlement.RemainingAmount = (decimal)totalAmount;
                }

                settlement.TotalAmount = (decimal)totalAmount;

                
                return Task.FromResult(settlement);
            }
            else
            {
                return Task.FromResult(new SettlementResponse());
            }

        }
    }
}
