using GradingPROProjectClient.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PROGradingProjectClient.Models;

namespace PROGradingProjectClient.Controllers
{
    public class LoginController : BaseNewController
    {
        public LoginController(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger logger) : base(httpClientFactory, httpContextAccessor, logger)
        {
        }

        [BindProperty]
        public LoginDTO Model { get; set; }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index([FromForm] LoginDTO model, string? returnUrl = null)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View();
                }
                else
                {
                    var response = await _httpClient.PostAsJsonAsync("Account/Login", model);
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();
                        if (result != null && result.Success)
                        {
                            if (result.Data != null)
                            {
                                var user = JsonConvert.DeserializeObject<UserInfo>(result.Data.ToString());
                                var cookieOptions = new CookieOptions
                                {
                                    HttpOnly = true,
                                    Expires = DateTimeOffset.UtcNow.AddHours(24)
                                };
                                Response.Cookies.Append("Grading-AccessToken", user.Token, cookieOptions);
                                HttpContext.Session.SetString("Grading-User", result.Data.ToString());
                                if (returnUrl != null)
                                {
                                    return Redirect(returnUrl);
                                }
                                return RedirectToAction("Index", "Home");
                            }
                        }
                        else
                        {
                            ModelState.AddModelError("ErrorMessage", result.Message);
                            return View();
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("ErrorMessage", "Invalid login attempt.");
                    }
                }
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Error", new { errorCode = 500 });
            }
            return View();
        }
    }
}
