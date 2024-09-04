using System.Collections.Generic;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// ISong Query Repository
    /// </summary>
    public interface ISongQueryRepository
    {
        /// <summary>
        /// Gets the song history by event identifier.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <param name="isUser">if set to <c>true</c> [is user].</param>
        /// <returns></returns>
        List<SongHistory> GetSongHistoryByEventId(long eventId, bool isUser);
        /// <summary>
        /// Gets the song history by user identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        List<SongHistoryModel> GetLiveSongRequests_AllEvents(long eventId, bool isAllRequest);
        List<SongHistoryModel> GetSongHistoryByUserId(long eventId, long userId, string songStatus, bool isAllRequest);
        /// <summary>
        /// Get the song history record based on order id
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        SongHistory GetSongHistoryByOrderId(string orderId);
        SongHistory GetSongHistoryById(long songHistoryId);

    }
}
