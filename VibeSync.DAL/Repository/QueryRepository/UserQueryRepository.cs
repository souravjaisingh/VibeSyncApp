using System.Collections.Generic;
using System.Linq;
using VibeSync.DAL.DBContext;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    /// <summary>
    /// User Query Repository
    /// </summary>
    /// <seealso cref="IUserQueryRepository" />
    public class UserQueryRepository : IUserQueryRepository
    {
        /// <summary>
        /// The database context
        /// </summary>
        private readonly IDBContextFactory _dbContext;
        /// <summary>
        /// The context
        /// </summary>
        private readonly VibeSyncContext _context;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserQueryRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public UserQueryRepository(IDBContextFactory context)
        {
            _dbContext = context;
            _context = _dbContext.GetDBContext();
        }

        /// <summary>
        /// Gets the user by email.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns></returns>
        public User GetUserByEmail(string email)
        {
            return _context.Users.Where(x => x.Email == email).FirstOrDefault();
        }

        /// <summary>
        /// Gets the user by identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        public User GetUserById(int userId)
        {
            return _context.Users.Where(x => x.Id == userId).FirstOrDefault();
        }

        /// <summary>
        /// Gets the users.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<User> GetUsers()
        {
            return _context.Users.ToList();
        }
    }
}
