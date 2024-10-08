﻿using System.Collections.Generic;
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
        /// Gets the song history by event identifier.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <param name="isUser">if set to <c>true</c> [is user].</param>
        /// <returns></returns>
        public List<SongHistory> GetSongHistoryByEventId(long eventId, bool isUser)
        {
            var query = _context.SongHistories
                .Join(
                    _context.Payments,
                    sh => sh.Id,
                    p => p.SongHistoryId,
                    (sh, p) => new { SongHistory = sh, Payment = p }
                )
                .Where(joined => joined.SongHistory.EventId == eventId &&
                                 joined.SongHistory.SongStatus != "Played" &&
                                 joined.SongHistory.SongStatus != "Rejected" &&
                                 joined.SongHistory.SongStatus != "Refunded");
            if (isUser)
            {
                query = query.Where(joined => joined.SongHistory.SongStatus != "Pending");
            }
            var finalQuery = query.OrderBy(x => x.SongHistory.CreatedOn)
                .Select(joined => new SongHistory
                {
                    Id = joined.SongHistory.Id,
                    UserId = joined.SongHistory.UserId,
                    EventId = joined.SongHistory.EventId,
                    DjId = joined.SongHistory.DjId,
                    SongName = joined.SongHistory.SongName,
                    SongId = joined.SongHistory.SongId,
                    SongStatus = joined.SongHistory.SongStatus,
                    CreatedOn = joined.SongHistory.CreatedOn,
                    CreatedBy = joined.SongHistory.CreatedBy,
                    ModifiedOn = joined.SongHistory.ModifiedOn,
                    ModifiedBy = joined.SongHistory.ModifiedBy,
                    Image = joined.SongHistory.Image,
                    ArtistId = joined.SongHistory.ArtistId,
                    ArtistName = joined.SongHistory.ArtistName,
                    AlbumName = joined.SongHistory.AlbumName,
                    MicAnnouncement = joined.SongHistory.MicAnnouncement,
                    ScreenAnnouncement = joined.SongHistory.ScreenAnnouncement,
                    Dj = joined.SongHistory.Dj,
                    Event = joined.SongHistory.Event,
                    User = joined.SongHistory.User,
                    Payments = joined.SongHistory.Payments.ToList()
                });

            return finalQuery.ToList();
        }


        /// <summary>
        /// Gets the song history by user identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        public List<SongHistoryModel> GetSongHistoryByUserId(long eventId, long userId, string songStatus, bool isAllRequest)
        {
            var query = _context.SongHistories.Join(
            _context.Payments,
            songHistory => songHistory.Id,
            payment => payment.SongHistoryId,
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
                UserId = songHistory.UserId,
                MicAnnouncement = songHistory.MicAnnouncement,
                ScreenAnnouncement = songHistory.ScreenAnnouncement
            });

            if (userId > 0)
            {
                query = query.Where(x => x.UserId == userId);
            }
            if (!string.IsNullOrWhiteSpace(songStatus))
            {
                query = query.Where(x => x.SongStatus.ToLower() == songStatus.ToLower());
            }
            if (isAllRequest)
            {
                query = query.Where(x => x.EventId == eventId);
            }

            return query.ToList();

        }
        /// <summary>
        /// Return the SongHistoryRecord based on orderId
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        public SongHistory GetSongHistoryByOrderId(string orderId)
        {
            return _context.SongHistories.Where(x => x.OrderId == orderId).FirstOrDefault();
        }

        public List<SongHistoryModel> GetLiveSongRequests_AllEvents(long eventId, bool isAllRequest)
        {
            var query = _context.SongHistories
       .Join(
           _context.Payments,
           sh => sh.Id,
           p => p.SongHistoryId,
           (sh, p) => new { SongHistory = sh, Payment = p }
       )
       .Join(
           _context.Events,
           joined => joined.SongHistory.EventId,
           e => e.Id,
           (joined, e) => new { SongHistory = joined.SongHistory, Payment = joined.Payment, Event = e }
       )
       .Where(joined => joined.SongHistory.SongStatus != "Played" &&
                        joined.SongHistory.SongStatus != "Rejected" &&
                        joined.SongHistory.SongStatus != "Refunded" &&
                        joined.SongHistory.SongStatus != "Unpaid" &&
                        joined.Payment.PaymentStatus == "PaymentSucceeded")
       .OrderBy(joined => joined.SongHistory.CreatedOn)
       .Select(joined => new SongHistoryModel
       {
           Id = joined.SongHistory.Id,
           UserId = joined.SongHistory.UserId,
           EventId = joined.SongHistory.EventId,
           DjId = joined.SongHistory.DjId,
           SongName = joined.SongHistory.SongName,
           SongId = joined.SongHistory.SongId,
           SongStatus = joined.SongHistory.SongStatus,
           CreatedOn = joined.SongHistory.CreatedOn,
           CreatedBy = joined.SongHistory.CreatedBy,
           ModifiedOn = joined.SongHistory.ModifiedOn,
           ModifiedBy = joined.SongHistory.ModifiedBy,
           Image = joined.SongHistory.Image,
           ArtistId = joined.SongHistory.ArtistId,
           ArtistName = joined.SongHistory.ArtistName,
           AlbumName = joined.SongHistory.AlbumName,
           MicAnnouncement = joined.SongHistory.MicAnnouncement,
           ScreenAnnouncement = joined.SongHistory.ScreenAnnouncement,
           EventName = joined.Event.EventName,
           TotalAmount = joined.Payment.TotalAmount,
           PaymentDateTime = joined.Payment.ModifiedOn,
           PaymentId = joined.Payment.PaymentId
       }).ToList();

            return query;
        }
        public SongHistory GetSongHistoryById(long songHistoryId)
        {
            return _context.SongHistories.Where(x => x.Id == songHistoryId).FirstOrDefault();
        }
    }
}
