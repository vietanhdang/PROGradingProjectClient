using Microsoft.AspNetCore.Mvc;
using PROGradingProjectClient.Models;
using System.Diagnostics;

namespace PROGradingProjectClient.Controllers
{
    public class ErrorController : Controller
    {

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Index(int? errorCode, string? returnUrl)
        {
            var title = "400 Bad Request";
            var message = "Sorry, your request is invalid.";
            switch (errorCode)
            {
                case 400:
                    title = "400 Bad Request";
                    message = "Sorry, your request is invalid.";
                    break;
                case 401:
                    title = "401 Unauthorized";
                    message = "Sorry, you are not authorized to access this page.";
                    break;
                case 403:
                    title = "403 Forbidden";
                    message = "Sorry, you are forbidden to access this page.";
                    break;
                case 404:
                    title = "404 Not Found";
                    message = "Sorry, the page you are looking for could not be found.";
                    break;
                case 500:
                    title = "500 Internal Server Error";
                    message = "Sorry, something went wrong.";
                    break;
                case 503:
                    title = "503 Service Unavailable";
                    message = "Sorry, the server is temporarily unavailable.";
                    break;
            }
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier, Title = title, Message = message, ErrorCode = errorCode, ReturnUrl = returnUrl });
        }
    }
}
