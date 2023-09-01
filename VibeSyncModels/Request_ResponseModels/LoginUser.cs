using MediatR;
using System.ComponentModel.DataAnnotations;

namespace VibeSyncModels.Request_ResponseModels
{
    /// <summary>
    /// Login User
    /// </summary>
    public class LoginUser : IRequest<bool>
    {
        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        /// <value>
        /// The password.
        /// </value>
        [MinLength(8)]
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
