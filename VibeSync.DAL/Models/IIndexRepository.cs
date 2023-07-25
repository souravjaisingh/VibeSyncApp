using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Models
{
    public interface IIndexRepository
    {
        public IEnumerable<User> GetUsers();
    }
}
