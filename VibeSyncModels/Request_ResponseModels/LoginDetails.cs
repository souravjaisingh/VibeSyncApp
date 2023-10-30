using System.Text.Json.Serialization;

namespace VibeSyncModels.Request_ResponseModels
{
    public class LoginDetails
    {
        public long Id { get; set; }
        public bool IsUser { get; set; }
        [JsonIgnore]
        public string Token { get; set; }
    }
}
