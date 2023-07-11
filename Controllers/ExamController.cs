using GradingPROProjectClient.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PROGradingProjectClient.Attributes;
using PROGradingProjectClient.Models;

namespace PROGradingProjectClient.Controllers
{
    public class ExamController : BaseNewController
    {
        public ExamController(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger logger) : base(httpClientFactory, httpContextAccessor, logger)
        {
        }

        /// <summary>
        /// Lấy ra các bài thi của sinh viên
        /// </summary>
        /// <returns></returns>
        [RoleCheck((int)Role.Student)]
        public async Task<IActionResult> Index(int page = 1, int pageSize = 8, string search = "")
        {
            try
            {
                var response = await _httpClient.GetAsync($"Exam/GetAllStudentExam?page={page}&pageSize={pageSize}&search={search}");
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                    if (result.Success)
                    {
                        if (result.Data != null)
                        {
                            var pagingModel = JsonConvert.DeserializeObject<PagingModel<ExamStudentResponse>>(result.Data.ToString());
                            pagingModel.Url = page => Url.Action("Index", new { page, pageSize, search });
                            pagingModel.Search = search;
                            return View(pagingModel);
                        }
                    }
                }
                else
                {
                    return RedirectToAction("Index", "Error", new { errorCode = 500 });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error");
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }
            return View();
        }

        /// <summary>
        /// Lấy ra chi tiết bài thi của sinh viên theo id
        /// </summary>
        /// <param name="examDetailId"></param>
        /// <returns></returns>
        [RoleCheck((int)Role.Student)]
        public async Task<IActionResult> ExamDetail(int? examDetailId)
        {
            try
            {
                var response = await _httpClient.GetAsync("Exam/" + examDetailId);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                    if (result.Success)
                    {
                        if (result.Data != null)
                        {
                            return View(JsonConvert.DeserializeObject<ExamStudentResponse>(result.Data.ToString()));
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("ErrorMessage", result.Message);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error");
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [RoleCheck((int)Role.Teacher)]
        public async Task<IActionResult> ExamManagement()
        {
            try
            {
                var response = await _httpClient.GetAsync("Exam/GetAllTeacherExam");
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                    if (result.Success)
                    {
                        if (result.Data != null)
                        {
                            return View(JsonConvert.DeserializeObject<List<Exam>>(result.Data.ToString()));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }
            return View();
        }

        [RoleCheck((int)Role.Teacher)]
        public async Task<IActionResult> ExamManagementDetail(int examId, string mode = "view")
        {
            try
            {
                ViewData["FormMode"] = mode;
                if (mode == "add")
                {
                    return View(new Exam());
                }
                if (examId != 0)
                {
                    var response = await _httpClient.GetAsync("Exam/teacher/" + examId);
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                        if (result.Success)
                        {
                            if (result.Data != null)
                            {
                                return View(JsonConvert.DeserializeObject<Exam>(result.Data.ToString()));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error");
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }

            return View();
        }

        [RoleCheck((int)Role.Teacher)]
        public async Task<IActionResult> ExamManagementResult(int examId)
        {
            try
            {
                if (examId > 0)
                {
                    var response = await _httpClient.GetAsync("Exam/getstudentexam?examId=" + examId);
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                        if (result.Success)
                        {
                            if (result.Data != null)
                            {
                                ViewData["ExamDetailJSON"] = result.Data;
                                return View(JsonConvert.DeserializeObject<Exam>(result.Data.ToString()));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }
            return View();
        }
    }
}
