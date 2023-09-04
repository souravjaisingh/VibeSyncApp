using System.Collections.Generic;
using VibeSyncModels.EntityModels;

namespace VibeSync.DAL.Repository.QueryRepository
{
    public interface IUserQueryRepository
    {
        IEnumerable<User> GetUsers();
        User GetUserById(int userId);
        User GetUserByEmail(string email);
        User ChecksIfUserIsValid(string email, string password);
    }
}
