using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VibeSync.DAL.Repository.CommandRepository;
using VibeSync.DAL.Repository.QueryRepository;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Handler
{
    public class SettlementsHandler : IRequestHandler<GetSettlementsDataByEventId, SettlementResponse>,
        IRequestHandler<SettleEventPayment, bool>
    {
        private readonly ISettlementsQueryRepository _settlementsQueryRepository;
        private readonly ISettlementsCommandRepository _settlementsCommandyRepository;
        public SettlementsHandler(ISettlementsQueryRepository settlementsQuery, ISettlementsCommandRepository settlementsCommand) 
        {
            _settlementsQueryRepository = settlementsQuery;
            _settlementsCommandyRepository = settlementsCommand;
        }
        public Task<SettlementResponse> Handle(GetSettlementsDataByEventId request, CancellationToken cancellationToken)
        {
            return _settlementsQueryRepository.GetSettlementDataByEventId(request);
        }

        public Task<bool> Handle(SettleEventPayment request, CancellationToken cancellationToken)
        {
            return _settlementsCommandyRepository.SettleEventPayment(request);
        }
    }
}
