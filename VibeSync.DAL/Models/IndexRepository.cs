using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Models
{
    public class IndexRepository :IIndexRepository
    {
        public VibeSyncContext _context;
        public IndexRepository()
        {
            _context = new VibeSyncContext();
        }
        
        public IEnumerable<User> GetUsers()
        {
            return _context.Users.ToList();
        }
    }
}
