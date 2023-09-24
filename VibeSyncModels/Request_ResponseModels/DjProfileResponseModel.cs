using System;

namespace VibeSyncModels.Request_ResponseModels
{
    public class DjProfileResponseModel
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string DjName { get; set; }
        public string ArtistName { get; set; }
        public string DjGenre { get; set; }
        public string DjDescription { get; set; }
        public string DjPhoto { get; set; }
        public string BankName { get; set; }
        public int? BankAccountNumber { get; set; }
        public string BranchName { get; set; }
        public string Ifsccode { get; set; }
        public string SocialLinks { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
