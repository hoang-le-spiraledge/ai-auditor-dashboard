using FraudDashboardCore.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace FraudDashboardCore.Controllers
{
    public class FraudLogsController : Controller
    {
        private readonly FraudLogService _service;
        public FraudLogsController(FraudLogService service) => _service = service;

        public async Task<IActionResult> Index()
        {
            var logs = await _service.GetAllAsync();
            ViewBag.DbOffline = logs.Count > 0 && logs.First().FraudId == "OFFLINE-001";
            return View(logs);
        }
    }
} 