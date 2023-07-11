using System.ComponentModel.DataAnnotations;

namespace PROGradingProjectClient.Models
{
    public class RegisterDTO
    {

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [RegularExpression(@"^\S+@(fpt\.edu\.vn|fe\.edu\.vn)$", ErrorMessage = "Email must be a valid @fpt.edu.vn or @fe.edu.vn address.")]
        public string? Email { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Code not empty")]
        public string? Code { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Fullname not empty")]
        public string? Fullname { get; set; }

        [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 50 characters")]
        public string? Password { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Confirm Password not empty")]
        [Compare("Password", ErrorMessage = "Confirm Password not match")]
        public string? ConfirmPassword { get; set; }

        /// <summary>
        /// Student's phone number
        /// </summary>
        [RegularExpression(@"^0[0-9]{9,10}$", ErrorMessage = "Phone number must be a valid Viet Nam phone number.")]
        public string Phone { get; set; }

        /// <summary>
        /// Student's address
        /// </summary>
        public string? Address { get; set; }

        public bool ToLogin { get; set; } = true;
    }
}
