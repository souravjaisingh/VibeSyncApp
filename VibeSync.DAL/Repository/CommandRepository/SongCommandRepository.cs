using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            songHisObj.SongStatus = Constants.SongStatusPending;
            songHisObj.CreatedOn = DateTime.Now;
            try
            {
                _context.SongHistories.Add(songHisObj);
                _context.SaveChanges();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            
            songHistoryId = songHisObj.Id;
        }

    }
}
