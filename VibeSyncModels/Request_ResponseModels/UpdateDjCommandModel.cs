using MediatR;
using System;
using System.ComponentModel.DataAnnotations;

namespace VibeSyncModels.Request_ResponseModels
{
    public class UpdateDjCommandModel : IRequest<string>
    {
        [Required]
        public long Id { get; set; }
        [Required]
        public long UserId { get; set; }
        [Required]
        public string DjName { get; set; }
        public string ArtistName { get; set; }
        public string DjGenre { get; set; }
        public string DjDescription { get; set; }
        public string DjPhoto { get; set; }
        public string BankName { get; set; }
        public string BankAccountNumber { get; set; }
        public string BranchName { get; set; }
        public string Ifsccode { get; set; }
        public string SocialLinks { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
