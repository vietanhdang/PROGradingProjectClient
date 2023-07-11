namespace PROGradingProjectClient.Models
{
    public class ExamStudentResponse
    {

        public int ExamId { get; set; }


        public int StudentId { get; set; }

        /// <summary>
        /// Start time
        /// </summary>
        public DateTime? StartTime { get; set; }

        /// <summary>
        /// Submit time
        /// </summary>
        public DateTime? SubmitedTime { get; set; }

        /// <summary>
        /// Submit folder
        /// </summary>
        public string? SubmitedFolder { get; set; }

        /// <summary>
        /// Student's status
        /// 0: Not submit
        /// 1: Start
        /// 2: Submitted
        /// 3: Submitted late
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// Student's Log
        /// </summary>
        public string? MarkLog { get; set; }

        /// <summary>
        /// Student's score
        /// </summary>
        public float? Score { get; set; }

        /// <summary>
        /// Count time student submit exam
        /// </summary>
        public int? CountTimeSubmit { get; set; }

        /// <summary>
        /// Exam's name
        /// </summary>
        public string? ExamName { get; set; }

        /// <summary>
        /// Exam's code
        /// </summary>
        public string? ExamCode { get; set; }

        /// <summary>
        /// Exam Start time
        /// </summary>
        public DateTime? ExamStartTime { get; set; }

        /// <summary>
        /// Exam End time
        /// </summary>
        public DateTime? ExamEndTime { get; set; }

        /// <summary>
        /// Exam folder
        /// </summary>
        public string? ExamQuestionFolder { get; set; }


        public int ExamStatus { get; set; }

        public int ExamStatusPermission
        {
            get
            { 
                if (ExamStatus == 0)
                {
                    // 0: Exam is not running
                    return 0;
                }
                else if (ExamStatus == 2 || (ExamStartTime != null && ExamEndTime != null && ExamStartTime.Value <= DateTime.Now && ExamEndTime.Value < DateTime.Now))
                {
                    // 2: Exam is over
                    return 2;
                }
                else if (ExamStatus == 1 && (ExamStartTime != null && ExamEndTime != null && ExamStartTime.Value <= DateTime.Now && ExamEndTime.Value > DateTime.Now))
                {
                    // 1: Exam is running
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
