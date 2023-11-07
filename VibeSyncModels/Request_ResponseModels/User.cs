using MediatR;
using System;
using System.ComponentModel.DataAnnotations;

namespace VibeSyncModels.Request_ResponseModels
{
    public class User : IRequest<LoginDetails>
    {
        public long Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]
        public string Email { get; set; }
        [RegularExpression(@"^([0]|\+91)?[789]\d{9}$")]
        public string PhoneNumber { get; set; }
        [MinLength(8)]
        public string Password { get; set; }
        [RegularExpression("male|female|other|m|f|o")]
        public string Gender { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsSsologin { get; set; }
        [RegularExpression("user|dj")]
        public string UserOrDj { get; set; }
    }
}
