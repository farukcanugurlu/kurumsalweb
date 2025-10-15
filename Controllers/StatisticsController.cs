using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatisticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var statistics = await _context.Statistics
                    .Where(s => s.IsActive)
                    .OrderBy(s => s.Order)
                    .ToListAsync();

                return Ok(new { success = true, data = statistics });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var statistic = await _context.Statistics.FindAsync(id);
                if (statistic == null)
                    return NotFound(new { success = false, message = "İstatistik bulunamadı" });

                return Ok(new { success = true, data = statistic });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Statistic statistic)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Geçersiz veri" });

                _context.Statistics.Add(statistic);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = statistic });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Statistic statistic)
        {
            try
            {
                if (id != statistic.Id)
                    return BadRequest(new { success = false, message = "ID uyuşmazlığı" });

                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Geçersiz veri" });

                var existingStatistic = await _context.Statistics.FindAsync(id);
                if (existingStatistic == null)
                    return NotFound(new { success = false, message = "İstatistik bulunamadı" });

                // Update properties
                existingStatistic.Title = statistic.Title;
                existingStatistic.Value = statistic.Value;
                existingStatistic.Icon = statistic.Icon;
                existingStatistic.Color = statistic.Color;
                existingStatistic.Order = statistic.Order;
                existingStatistic.IsActive = statistic.IsActive;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingStatistic });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var statistic = await _context.Statistics.FindAsync(id);
                if (statistic == null)
                    return NotFound(new { success = false, message = "İstatistik bulunamadı" });

                _context.Statistics.Remove(statistic);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "İstatistik silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<Statistic> statistics)
        {
            try
            {
                foreach (var statistic in statistics)
                {
                    var existingStatistic = await _context.Statistics.FindAsync(statistic.Id);
                    if (existingStatistic != null)
                    {
                        existingStatistic.Order = statistic.Order;
                    }
                }

                await _context.SaveChangesAsync();

                var updatedStatistics = await _context.Statistics
                    .Where(s => s.IsActive)
                    .OrderBy(s => s.Order)
                    .ToListAsync();

                return Ok(new { success = true, data = updatedStatistics });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
