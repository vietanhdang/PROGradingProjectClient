using System.ComponentModel.DataAnnotations;

namespace PROGradingProjectClient.Models
{
    public class Exam
    {
        public int ExamId { get; set; }
        public int TeacherId { get; set; }

        [Required(ErrorMessage = "Exam Name is required")]
        public string ExamName { get; set; }

        [Required(ErrorMessage = "Exam Code is required")]
        public string ExamCode { get; set; }
        public string? Password { get; set; }
        public string? QuestionFolder { get; set; }
        [Required(ErrorMessage = "Question File is required")]
        public IFormFile? QuestionFile { get; set; }
        public string? TestCaseFolder { get; set; }
        [Required(ErrorMessage = "Test Case File is required")]
        public IFormFile? TestCaseFile { get; set; }

        [Required(ErrorMessage = "Total Score is required")]
        public float? TotalScore { get; set; } = 10;
        public string? AnswerFolder { get; set; }
        public IFormFile? AnswerFile { get; set; }

        [Required(ErrorMessage = "Total Questions is required")]
        public int? TotalQuestions { get; set; }

        [Required(ErrorMessage = "Start Time is required")]
        public DateTime? StartTime { get; set; }

        [Required(ErrorMessage = "End Time is required")]
        public DateTime? EndTime { get; set; }

        public int Status { get; set; }

        public bool IsStudentTakeExam { get; set; } = false;

        public ICollection<ExamStudentCustomDTO>? ExamStudents { get; set; }

        public bool IsShowScore { get; set; }
    }
}
