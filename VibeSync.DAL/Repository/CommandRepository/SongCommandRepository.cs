using AutoMapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// SongCommandRepository
    /// </summary>
    public class SongCommandRepository : ISongCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;
        public SongCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
        }

        public void AddSongHistoryForUser(PersistSongHistoryPaymentRequest request, out long songHistoryId)
        {
            var songHisObj = _mapper.Map<SongHistory>(request);
            songHisObj.CreatedBy = request.UserId.ToString();
            songHisObj.SongStatus = request.SongStatus ?? Constants.SongStatusPending;
            DateTime istNow = DateTime.UtcNow + TimeSpan.FromHours(5.5);
            songHisObj.CreatedOn = istNow;
            try
            {
                _context.SongHistories.Add(songHisObj);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            songHistoryId = songHisObj.Id;
        }

        public async Task<string> UpdateSongHistory(SongHistoryModel request)
        {
            var songHistoryEntity = _context.SongHistories.Where(x => x.Id == request.Id).FirstOrDefault();
            if (songHistoryEntity != null)
            {
                songHistoryEntity.SongStatus = request.SongStatus;
                songHistoryEntity.ModifiedBy = request.UserId.ToString();
                songHistoryEntity.ModifiedOn = DateTime.Now;
                var response = await _context.SaveChangesAsync();

                if (response > 0)
                {
                    return Constants.UpdatedSuccessfully;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
            else
            {
                throw new CustomException("Entity not found");
            }
        }

        public long UpdateSongHistoryFromWebHook(string orderId, out string songName)
        {
            var songHistoryEntity = _context.SongHistories.Where(x => x.OrderId == orderId).FirstOrDefault();
            if (songHistoryEntity != null)
            {
                songName = songHistoryEntity.SongName;
                songHistoryEntity.SongStatus = Constants.SongStatusPending;
                songHistoryEntity.ModifiedBy = "webhook";
                songHistoryEntity.ModifiedOn = DateTime.Now;
                var response = _context.SaveChanges();

                if (response > 0)
                {
                    return songHistoryEntity.Id;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
            else
            {
                throw new CustomException("Entity not found");
            }
        }
    }
}
