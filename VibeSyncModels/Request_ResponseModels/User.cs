﻿using MediatR;
using System;
using System.ComponentModel.DataAnnotations;

namespace VibeSyncModels.Request_ResponseModels
{
    public class User : IRequest<string>
    {
        public long Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        [RegularExpression(@"^([0]|\+91)?[789]\d{9}$")]
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsSsologin { get; set; }
        public string UserOrDj { get; set; }
    }
}