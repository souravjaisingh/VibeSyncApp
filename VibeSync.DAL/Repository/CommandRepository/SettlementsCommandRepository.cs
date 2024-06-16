using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class SettlementsCommandRepository : ISettlementsCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;

        /// <summary>
        /// ILogger
        /// </summary>
        private readonly ILogger<PaymentCommandRepository> _logger;

        public SettlementsCommandRepository(IDBContextFactory context, ILogger<PaymentCommandRepository> logger)
        {
            _context = context.GetDBContext();
            _logger = logger;
        }

        public async Task<bool> SettleEventPayment(SettleEventPayment request)
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

            var settlement = _context.Settlements.OrderByDescending(x => x.Id).FirstOrDefault(x => x.EventId == request.EventId);

            Settlement obj = new Settlement()
            {
                EventId = request.EventId,
                Amount = request.SettlementAmount,
                CreatedBy = "admin",
                DateCreated = DateTime.Now,
                RemainingAmount = (decimal)(settlement != null && settlement.Id != null ? (settlement.RemainingAmount - request.SettlementAmount) : (totalAmount - request.SettlementAmount)),
            };
            await _context.Settlements.AddAsync(obj);
            return await _context.SaveChangesAsync() > 0;

        }
    }
}
