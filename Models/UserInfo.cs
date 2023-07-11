﻿namespace GradingPROProjectClient.Models
{
    public class UserInfo
    {

        public int AccountId { get; set; }
        public string? Password { get; set; }
        public string Email { get; set; }
        public string Fullname { get; set; }
        public string Code { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int? Role { get; set; }
        public string? Token { get; set; }
    }
}
