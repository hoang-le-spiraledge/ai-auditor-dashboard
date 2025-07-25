using FraudDashboardCore.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace FraudDashboardCore.Controllers
{
    public class DashboardController : Controller
    {
        private readonly FraudLogService _service;
        public DashboardController(FraudLogService service) => _service = service;

        public async Task<IActionResult> Index()
        {
            var logs = await _service.GetAllAsync();

            // Handle DB offline banner logic (reuse existing convention)
            ViewBag.DbOffline = logs.Count > 0 && logs.First().FraudId == "OFFLINE-001";

            // Calculate key metrics
            var totalDetections = logs.Count;
            var criticalIssues = logs.Count(l => l.Risk >= 80);
            var totalSavings = logs.Sum(l => decimal.TryParse(l.Savings, out var val) ? val : 0);
            var averageRisk = logs.Count == 0 ? 0 : (int)logs.Average(l => l.Risk);

            // Pass metrics to the View via ViewBag (simple & avoids extra view-model class for now)
            ViewBag.Metrics = new
            {
                totalDetections,
                criticalIssues,
                totalSavings,
                averageRisk
            };
            return View(logs);
        }
    }
} 