using System.Collections.Generic;
using System.Linq;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// Song Query Repository
    /// </summary>
    /// <seealso cref="VibeSync.DAL.Repository.QueryRepository.ISongQueryRepository" />
    public class SongQueryRepository : ISongQueryRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// Initializes a new instance of the <see cref="SongQueryRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public SongQueryRepository(IDBContextFactory context)
        {
            _context = context.GetDBContext();
        }
        /// <summary>
        /// Gets the song history.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <returns></returns>
        public List<SongHistory> GetSongHistoryByEventId(long eventId)
        {
            return _context.SongHistories.Where(x => x.EventId == eventId)
                .Where(x => x.SongStatus != "Rejected" && x.SongStatus != "Played")
                .OrderBy(x => x.CreatedOn).ToList();
        }

        /// <summary>
        /// Gets the song history by user identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        public List<SongHistoryModel> GetSongHistoryByUserId(long userId)
        {
            return _context.SongHistories.Join(
                _context.Payments,
                songHistory => songHistory.Id,
                payments => payments.SongHistoryId,
                (songHistory, payment) => new SongHistoryModel
                {
                    Id = songHistory.Id,
                    DjId = songHistory.DjId,
                    EventId = songHistory.EventId,
                    AlbumName = songHistory.AlbumName,
                    ArtistId = songHistory.ArtistId,
                    ArtistName = songHistory.ArtistName,
                    CreatedBy = songHistory.CreatedBy,
                    CreatedOn = songHistory.CreatedOn,
                    Image = songHistory.Image,
                    PaymentDateTime = payment.ModifiedOn,
                    PaymentId = payment.PaymentId,
                    SongName = songHistory.SongName,
                    SongId = songHistory.SongId,
                    SongStatus = songHistory.SongStatus,
                    TotalAmount = payment.TotalAmount,
                    UserId = songHistory.UserId
                }).Where(x => x.UserId == userId)
                .ToList();
        }
    }
}
