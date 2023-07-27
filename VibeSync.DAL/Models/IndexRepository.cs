using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VibeSync.DAL.Models.DAL;

namespace VibeSync.DAL.Models
{
    public class IndexRepository :IIndexRepository
    {
        private readonly IUserRepository _user;
        public IndexRepository(IUserRepository user)
        {
            _user = user;
        }
        
        public IEnumerable<User> GetUsers()
        {
            return _user.GetUsers();
        }
        
    }
}
