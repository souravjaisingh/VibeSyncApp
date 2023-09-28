using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public interface ISongCommandRepository
    {
        void AddSongHistoryForUser(PersistSongHistoryPaymentRequest request, out long songHistoryId);
    }
}
