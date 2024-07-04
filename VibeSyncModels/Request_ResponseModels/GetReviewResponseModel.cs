using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VibeSyncModels.Request_ResponseModels
{
    public class GetReviewResponseModel
    {
        public long Id { get; set; }
        public long DjId { get; set; }
        public long EventId { get; set; }
        public string Review1 { get; set; }
        public short? Star { get; set; }
        public string CreatedBy { get; set; }
 
    }
}
