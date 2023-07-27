using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Models.DAL
{
    public interface IUserRepository
    {
        IEnumerable<User> GetUsers();
        User GetUserById(int userId);
        User GetUserByEmail(string email);
        User GetUserNyPhoneNumber(string phoneNumber);
        int CreateUser(User user);
        int DeleteUser(int userId);
        int SaveChanges();

    }
}
