namespace GradingPROProjectClient.Models
{
    /// <summary>
    /// Class chứa thông tin trả về cho client từ service
    /// </summary>
    public class ServiceResponse
    {
        /// <summary>
        /// Trạng thái của response
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Thông điệp trả về cho client
        /// </summary>
        public string? Message { get; set; }

        /// <summary>
        /// Dữ liệu trả về cho client
        /// </summary>
        public object? Data { get; set; }

        /// <summary>
        /// Mã lỗi
        /// </summary>
        public int? ErrorCode { get; set; }
    }
}
