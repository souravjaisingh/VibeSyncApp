using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Models.DAL
{
    public class UserRepository : IUserRepository
    {
        private readonly IDBContextFactory _dbContext;
        private readonly VibeSyncContext _context;
        public UserRepository(IDBContextFactory context)
        {
            _dbContext = context;
            _context = _dbContext.GetDBContext();
        }
        public int CreateUser(User user)
        {
            throw new NotImplementedException();
        }

        public int DeleteUser(int userId)
        {
            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();
            user.IsActive = false;
            return SaveChanges();
        }

        public User GetUserByEmail(string email)
        {
            return _context.Users.Where(x => x.Email == email).FirstOrDefault();
        }

        public User GetUserById(int userId)
        {
            return _context.Users.Where(x => x.Id == userId).FirstOrDefault();
        }

        public User GetUserNyPhoneNumber(string phoneNumber)
        {
            return _context.Users.Where(x => x.PhoneNumber == phoneNumber).FirstOrDefault();
        }

        public IEnumerable<User> GetUsers()
        {
            return _context.Users.ToList();
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
