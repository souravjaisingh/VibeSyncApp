using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.EntityModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    public class DjCommandRepository : IDjCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        private readonly IMapper _mapper;



        /// <summary>
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public DjCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
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
                // Function to return null if value is "null" or null, otherwise the value itself
                string HandleNullOrValue(string value) => value == "null" ? null : value;

                // Update properties
                djEntity.DjName = HandleNullOrValue(request.DjName);
                djEntity.ArtistName = HandleNullOrValue(request.ArtistName);
                djEntity.DjGenre = HandleNullOrValue(request.DjGenre);
                djEntity.DjDescription = HandleNullOrValue(request.DjDescription);
                djEntity.DjPhoto = HandleNullOrValue(request.DjPhoto);
                djEntity.BankName = HandleNullOrValue(request.BankName);
                djEntity.BankAccountNumber = !string.IsNullOrEmpty(request.BankAccountNumber) && request.BankAccountNumber != "null"
                    ? int.TryParse(request.BankAccountNumber, out int accountNumber) ? accountNumber : (int?)null
                    : null;
                djEntity.BranchName = HandleNullOrValue(request.BranchName);
                djEntity.Ifsccode = HandleNullOrValue(request.Ifsccode);
                djEntity.SocialLinks = HandleNullOrValue(request.SocialLinks);
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

        public async Task<bool> CreateReview(ReviewDetails request)
        {
            var reviewDetails = _mapper.Map<Review>(request);
            if (reviewDetails == null)
            {
                throw new ArgumentNullException(nameof(reviewDetails));
            }

            reviewDetails.CreatedOn = DateTime.Now;
            _context.Set<Review>().Add(reviewDetails);

            try
            {
                var response = await _context.SaveChangesAsync();
                if (response > 0)
                {
                    return true;
                }
                else
                {
                    throw new CustomException(Constants.DbOperationFailed);
                }
            }
            catch (Exception ex)
            {
          
                throw new CustomException(Constants.DbOperationFailed);
            }



        }

    }
}
