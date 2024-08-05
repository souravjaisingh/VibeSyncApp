using System.Collections.Generic;

namespace VibeSyncModels.Request_ResponseModels
{
    public class PaginatedSongHistoryResponse
    {
        public List<SongHistoryModel> SongHistories { get; set; }
        public int TotalCount { get; set; }
    }
}