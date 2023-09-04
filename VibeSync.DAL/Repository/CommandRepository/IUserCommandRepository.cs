using System.Threading.Tasks;
using VibeSyncModels.Request_ResponseModels;

namespace VibeSync.DAL.Repository.CommandRepository
{
    /// <summary>
    /// IUser Command Repository
    /// </summary>
    public interface IUserCommandRepository
    {
        /// <summary>
        /// Creates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        Task<long> CreateUser(User user);
        /// <summary>
        /// Deletes the user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        Task<int> DeleteUser(int userId);
    }
}
