﻿using System.Collections.Generic;
using VibeSyncModels.EntityModels;

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
        /// <returns></returns>
        List<SongHistory> GetSongHistoryByEventId(long eventId);
        /// <summary>
        /// Gets the song history by user identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        List<SongHistory> GetSongHistoryByUserId(long userId);
    }
}