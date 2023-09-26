using System;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.Request_ResponseModels;
using System.Linq;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class DjCommandRepository : IDjCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public DjCommandRepository(IDBContextFactory context)
        {
            _context = context.GetDBContext();
        }
        /// <summary>
        /// Updates the dj.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        /// <exception cref="VibeSyncModels.CustomException"></exception>
        public async Task<string> UpdateDj(UpdateDjCommandModel request)
        {
            var djEntity = _context.Djs.Where(x => x.Id == request.Id).FirstOrDefault();
            if (djEntity != null)
            {
                // Update the properties of djEntity with values from the request
                djEntity.DjName = request.DjName;
                djEntity.ArtistName = request.ArtistName;
                djEntity.DjGenre = request.DjGenre;
                djEntity.DjDescription = request.DjDescription;
                djEntity.DjPhoto = request.DjPhoto;
                djEntity.BankName = request.BankName;
                djEntity.BankAccountNumber = request.BankAccountNumber;
                djEntity.BranchName = request.BranchName;
                djEntity.Ifsccode = request.Ifsccode;
                djEntity.SocialLinks = request.SocialLinks;
                djEntity.ModifiedOn = DateTime.Now;
                djEntity.ModifiedBy = request.ModifiedBy;
                // Save changes to the database
                var response = await _context.SaveChangesAsync();

                if (response > 0)
                {
                    return request.Id.ToString();
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
