using GradingPROProjectClient.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace PROGradingProjectClient.Controllers
{
    public class AccountController : BaseNewController
    {
        public AccountController(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger logger) : base(httpClientFactory, httpContextAccessor, logger)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Index(string mode = "view")
        {
            try
            {
                if (mode == "edit")
                {
                    ViewData["FormMode"] = "edit";
                }
                var response = await _httpClient.GetAsync("account");
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                    if (result.Success)
                    {
                        if (result.Data != null)
                        {
                            return View(JsonConvert.DeserializeObject<UserInfo>(result.Data.ToString()));
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("ErrorMessage", result.Message);
                    }
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }
            return View();
        }

        public IActionResult Logout()
        {
            Response.Cookies.Delete("Grading-AccessToken");
            HttpContext.Session.Remove("Grading-User");
            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        public IActionResult RefreshToken()
        {
            HttpContext.Session.Remove("Grading-User");
            return Ok();
        }
    }
}
