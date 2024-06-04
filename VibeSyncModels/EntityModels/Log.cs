using System;
using System.Collections.Generic;

#nullable disable

namespace VibeSyncModels.EntityModels
{
    public partial class Log
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public int LogLevel { get; set; }
        public string Message { get; set; }
        public string Exception { get; set; }
        public string Logger { get; set; }
        public string RemoteIpAddress { get; set; }
    }
}
