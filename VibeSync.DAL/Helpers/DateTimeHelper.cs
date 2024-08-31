using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSync.DAL.Helpers
{
    public class DateTimeHelper
    {
        public static DateTime GetISTDateTime()
        {
            DateTime utcNow = DateTime.UtcNow;
            TimeSpan istOffset = TimeSpan.FromHours(5.5);
            DateTime istTime = utcNow + istOffset;
            return istTime;
        }
    }
}
