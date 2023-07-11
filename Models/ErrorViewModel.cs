namespace PROGradingProjectClient.Models
{
    public class ErrorViewModel
    {
        public string? RequestId { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public int? ErrorCode { get; set; }

        public string? ReturnUrl { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}