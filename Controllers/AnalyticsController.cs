using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;
using System.Globalization;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("track")]
        public async Task<IActionResult> TrackVisit([FromBody] AnalyticsData data)
        {
            try
            {
                var analytics = new WebsiteAnalytics
                {
                    Date = DateTime.Now,
                    PageViews = 1,
                    UniqueVisitors = 1,
                    Sessions = 1,
                    BounceRate = 0,
                    AverageSessionDuration = 0,
                    PageUrl = data.PageUrl ?? "/",
                    Referrer = data.Referrer ?? "direct",
                    UserAgent = data.UserAgent ?? "",
                    IpAddress = GetClientIpAddress(),
                    Country = data.Country ?? "Unknown",
                    City = data.City ?? "Unknown",
                    DeviceType = data.DeviceType ?? "desktop",
                    Browser = data.Browser ?? "Unknown",
                    OperatingSystem = data.OperatingSystem ?? "Unknown"
                };

                _context.WebsiteAnalytics.Add(analytics);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Visit tracked successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetAnalyticsSummary([FromQuery] string period = "daily")
        {
            try
            {
                var now = DateTime.Now;
                var startDate = period switch
                {
                    "daily" => now.Date,
                    "weekly" => now.AddDays(-7).Date,
                    "monthly" => now.AddMonths(-1).Date,
                    "yearly" => now.AddYears(-1).Date,
                    _ => now.Date
                };

                var analytics = await _context.WebsiteAnalytics
                    .Where(a => a.Date >= startDate)
                    .ToListAsync();

                var summary = new
                {
                    period = period,
                    totalPageViews = analytics.Sum(a => a.PageViews),
                    totalUniqueVisitors = analytics.Select(a => a.IpAddress).Distinct().Count(),
                    totalSessions = analytics.Sum(a => a.Sessions),
                    averageBounceRate = analytics.Any() ? analytics.Average(a => a.BounceRate) : 0,
                    averageSessionDuration = analytics.Any() ? analytics.Average(a => a.AverageSessionDuration) : 0,
                    topPages = analytics
                        .GroupBy(a => a.PageUrl)
                        .OrderByDescending(g => g.Count())
                        .Take(10)
                        .Select(g => new { page = g.Key, views = g.Count() }),
                    topCountries = analytics
                        .GroupBy(a => a.Country)
                        .OrderByDescending(g => g.Count())
                        .Take(10)
                        .Select(g => new { country = g.Key, visitors = g.Count() }),
                    deviceTypes = analytics
                        .GroupBy(a => a.DeviceType)
                        .Select(g => new { device = g.Key, count = g.Count() }),
                    browsers = analytics
                        .GroupBy(a => a.Browser)
                        .OrderByDescending(g => g.Count())
                        .Take(5)
                        .Select(g => new { browser = g.Key, count = g.Count() })
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("chart-data")]
        public async Task<IActionResult> GetChartData([FromQuery] string period = "daily", [FromQuery] int days = 30)
        {
            try
            {
                var endDate = DateTime.Now.Date;
                var startDate = endDate.AddDays(-days);

                var analytics = await _context.WebsiteAnalytics
                    .Where(a => a.Date >= startDate && a.Date <= endDate)
                    .ToListAsync();

                var chartData = period switch
                {
                    "daily" => analytics
                        .GroupBy(a => a.Date.Date)
                        .OrderBy(g => g.Key)
                        .Select(g => new
                        {
                            date = g.Key.ToString("yyyy-MM-dd"),
                            pageViews = g.Sum(a => a.PageViews),
                            uniqueVisitors = g.Select(a => a.IpAddress).Distinct().Count(),
                            sessions = g.Sum(a => a.Sessions)
                        }),
                    "weekly" => analytics
                        .GroupBy(a => GetWeekStart(a.Date))
                        .OrderBy(g => g.Key)
                        .Select(g => new
                        {
                            date = g.Key.ToString("yyyy-MM-dd"),
                            pageViews = g.Sum(a => a.PageViews),
                            uniqueVisitors = g.Select(a => a.IpAddress).Distinct().Count(),
                            sessions = g.Sum(a => a.Sessions)
                        }),
                    "monthly" => analytics
                        .GroupBy(a => new { a.Date.Year, a.Date.Month })
                        .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                        .Select(g => new
                        {
                            date = $"{g.Key.Year}-{g.Key.Month:00}",
                            pageViews = g.Sum(a => a.PageViews),
                            uniqueVisitors = g.Select(a => a.IpAddress).Distinct().Count(),
                            sessions = g.Sum(a => a.Sessions)
                        }),
                    _ => analytics
                        .GroupBy(a => a.Date.Date)
                        .OrderBy(g => g.Key)
                        .Select(g => new
                        {
                            date = g.Key.ToString("yyyy-MM-dd"),
                            pageViews = g.Sum(a => a.PageViews),
                            uniqueVisitors = g.Select(a => a.IpAddress).Distinct().Count(),
                            sessions = g.Sum(a => a.Sessions)
                        })
                };

                return Ok(new { success = true, data = chartData });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("realtime")]
        public async Task<IActionResult> GetRealtimeData()
        {
            try
            {
                var now = DateTime.Now;
                var last24Hours = now.AddHours(-24);

                var realtimeData = await _context.WebsiteAnalytics
                    .Where(a => a.Date >= last24Hours)
                    .GroupBy(a => a.Date.Hour)
                    .OrderBy(g => g.Key)
                    .Select(g => new
                    {
                        hour = g.Key,
                        visitors = g.Select(a => a.IpAddress).Distinct().Count(),
                        pageViews = g.Sum(a => a.PageViews)
                    })
                    .ToListAsync();

                var currentVisitors = await _context.WebsiteAnalytics
                    .Where(a => a.Date >= now.AddMinutes(-5))
                    .Select(a => a.IpAddress)
                    .Distinct()
                    .CountAsync();

                return Ok(new { 
                    success = true, 
                    data = new { 
                        hourlyData = realtimeData,
                        currentVisitors = currentVisitors,
                        lastUpdated = now
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        private string GetClientIpAddress()
        {
            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (string.IsNullOrEmpty(ipAddress))
            {
                ipAddress = Request.Headers["X-Real-IP"].FirstOrDefault();
            }
            if (string.IsNullOrEmpty(ipAddress))
            {
                ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            }
            return ipAddress ?? "Unknown";
        }

        private DateTime GetWeekStart(DateTime date)
        {
            var diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-1 * diff).Date;
        }
    }

    public class AnalyticsData
    {
        public string? PageUrl { get; set; }
        public string? Referrer { get; set; }
        public string? UserAgent { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? DeviceType { get; set; }
        public string? Browser { get; set; }
        public string? OperatingSystem { get; set; }
    }
}
