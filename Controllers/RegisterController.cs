using GradingPROProjectClient.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PROGradingProjectClient.Models;

namespace PROGradingProjectClient.Controllers
{
    public class RegisterController : BaseNewController
    {
        public RegisterController(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger logger) : base(httpClientFactory, httpContextAccessor, logger)
        {
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index([FromForm] RegisterDTO model)
        {
            ViewBag.ServerValidate = true;
            if (!ModelState.IsValid)
            {
                ViewBag.ServerValidate = false;
                return View();
            }
            else
            {
                try
                {
                    var response = await _httpClient.PostAsJsonAsync("account/register", model);
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
                                return RedirectToAction("Index", "Home");
                            }
                        }
                        else
                        {
                            if (result.Message == "Invalid data")
                            {
                                var errors = JsonConvert.DeserializeObject<Dictionary<string, string[]>>(result.Data.ToString());
                                foreach (var error in errors)
                                {
                                    ModelState.AddModelError(error.Key, error.Value[0]);
                                }
                            }
                            else
                            {
                                ModelState.AddModelError("ErrorMessage", result.Message);
                            }
                            return View();
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("ErrorMessage", "Invalid login attempt.");
                    }
                }
                catch (System.Exception)
                {

                    return RedirectToAction("Index", "Error", new { errorCode = 500 });
                }

            }
            return View();
        }
    }
}
