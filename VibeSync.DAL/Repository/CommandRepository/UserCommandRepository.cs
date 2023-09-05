using AutoMapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using VibeSync.DAL.DBContext;
using VibeSyncModels;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// User Command Repository
    /// </summary>
    /// <seealso cref="VibeSync.DAL.Repository.CommandRepository.IUserCommandRepository" />
    public class UserCommandRepository : IUserCommandRepository
    {
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// The mapper
        /// </summary>
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserCommandRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public UserCommandRepository(IDBContextFactory context, IMapper mapper)
        {
            _context = context.GetDBContext();
            _mapper = mapper;
        }

        /// <summary>
        /// Creates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        public async Task<long> CreateUser(User user)
        {
            var getUser = _context.Users.Where(x => x.Email == user.Email).FirstOrDefault();
            if (getUser != null && !user.IsSsologin)
                throw new CustomException(Constants.UserAlreadyExists);
            else if (user.IsSsologin && getUser != null)
                return getUser.Id;
            else
            {
                user.CreatedOn = DateTime.Now;
                user.CreatedBy = user.Email;
                user.IsActive = true;
                user.Gender = user.Gender != null ? char.ToUpper(user.Gender[0]).ToString() : null;
                user.Password = user.IsSsologin ? Guid.NewGuid().ToString() : user.Password;

                _context.Users.Add(_mapper.Map<VibeSyncModels.EntityModels.User>(user));
                var response = await _context.SaveChangesAsync();
                if (response > 0)
                    return Convert.ToInt64(response);
                else
                    throw new CustomException(Constants.DbOperationFailed);
            }
        }

        /// <summary>
        /// Deletes the user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        public async Task<int> DeleteUser(int userId)
        {
            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
            user.IsActive = false;
            return await _context.SaveChangesAsync();
        }
    }
}
