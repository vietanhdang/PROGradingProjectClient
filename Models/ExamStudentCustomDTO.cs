namespace PROGradingProjectClient.Models
{
    public class ExamStudentCustomDTO
    {
        public int ExamStudentId { get; set; }
        public int StudentId { get; set; }
        public string? StudentName { get; set; }
        public string? StudentCode { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? SubmitedTime { get; set; }
        public string? SubmitedFolder { get; set; }
        public int Status { get; set; }
        public string? MarkLog { get; set; }
        public float? Score { get; set; }
        public int? CountTimeSubmit { get; set; }
    }
}
