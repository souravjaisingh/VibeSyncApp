using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Models.DAL
{
    public interface IDBContextFactory
    {
        VibeSyncContext GetDBContext();
    }
}
