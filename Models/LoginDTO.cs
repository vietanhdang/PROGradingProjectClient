using System.ComponentModel.DataAnnotations;

namespace PROGradingProjectClient.Models
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [RegularExpression(@"^\S+@fpt\.edu\.vn$", ErrorMessage = "Email must be a valid @fpt.edu.vn address.")]
        public string? Email { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Password not empty")]
        public string? Password { get; set; }
    }
}
