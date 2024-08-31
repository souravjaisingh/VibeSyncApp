using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class DeviceManagement
    {
        public long Id { get; set; }
        public long? DjId { get; set; }
        public string DeviceId { get; set; }
        public string FcmToken { get; set; }
        public DateTime? CreatedOn { get; set; }

        public virtual Dj Dj { get; set; }
    }
}
