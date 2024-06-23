using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface ISettlementsQueryRepository
    {
        Task<SettlementResponse> GetSettlementDataByEventId(GetSettlementsDataByEventId request);
        Task<SettlementResponseModel> GetSettlementByUserId(SettlementRequestModel request);
    }
}
