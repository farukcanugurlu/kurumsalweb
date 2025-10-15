using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizationChartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrganizationChartController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var charts = await _context.OrganizationCharts
                    .AsNoTracking()
                    .Where(c => c.IsActive)
                    .OrderBy(c => c.Order)
                    .ThenBy(c => c.Title)
                    .Select(c => new {
                        c.Id,
                        c.Title,
                        c.ParentId,
                        c.Order,
                        c.IsActive,
                        c.CreatedAt,
                        c.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = charts });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAll error: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            try
            {
                var charts = await _context.OrganizationCharts
                    .AsNoTracking()
                    .OrderBy(c => c.Order)
                    .ThenBy(c => c.Title)
                    .Select(c => new {
                        c.Id,
                        c.Title,
                        c.ParentId,
                        c.Order,
                        c.IsActive,
                        c.CreatedAt,
                        c.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = charts });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAllForAdmin error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var chart = await _context.OrganizationCharts
                    .AsNoTracking()
                    .Where(c => c.Id == id)
                    .Select(c => new {
                        c.Id,
                        c.Title,
                        c.ParentId,
                        c.Order,
                        c.IsActive,
                        c.CreatedAt,
                        c.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (chart == null)
                {
                    return NotFound(new { success = false, message = "Organizasyon şeması bulunamadı" });
                }

                return Ok(new { success = true, data = chart });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetById error: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrganizationChart chart)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Geçersiz veri", errors = ModelState });
                }

                // Frontend'den gelen CreatedAt string'ini DateTime'a çevir
                chart.CreatedAt = DateTime.Now;
                
                _context.OrganizationCharts.Add(chart);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = chart, message = "Organizasyon şeması başarıyla eklendi" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Create OrganizationChart error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrganizationChart chart)
        {
            try
            {
                if (id != chart.Id)
                {
                    return BadRequest(new { success = false, message = "ID uyuşmazlığı" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Geçersiz veri", errors = ModelState });
                }

                var existingChart = await _context.OrganizationCharts.FindAsync(id);
                if (existingChart == null)
                {
                    return NotFound(new { success = false, message = "Organizasyon şeması bulunamadı" });
                }

                // Update properties
                existingChart.Title = chart.Title;
                existingChart.ParentId = chart.ParentId;
                existingChart.Order = chart.Order;
                existingChart.IsActive = chart.IsActive;
                existingChart.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingChart, message = "Organizasyon şeması başarıyla güncellendi" });
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
                var chart = await _context.OrganizationCharts.FindAsync(id);
                if (chart == null)
                {
                    return NotFound(new { success = false, message = "Organizasyon şeması bulunamadı" });
                }

                _context.OrganizationCharts.Remove(chart);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Organizasyon şeması başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<OrganizationChart> charts)
        {
            try
            {
                foreach (var chart in charts)
                {
                    var existingChart = await _context.OrganizationCharts.FindAsync(chart.Id);
                    if (existingChart != null)
                    {
                        existingChart.Order = chart.Order;
                        existingChart.ParentId = chart.ParentId;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Sıralama başarıyla güncellendi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("fix-hierarchy")]
        public async Task<IActionResult> FixHierarchy()
        {
            try
            {
                // DENETİM KURULU'nu GENEL KURUL'un altına yerleştir
                var denetimKurulu = await _context.OrganizationCharts.FindAsync(3);
                if (denetimKurulu != null)
                {
                    denetimKurulu.ParentId = 1; // GENEL KURUL
                    denetimKurulu.Order = 2;
                    denetimKurulu.UpdatedAt = DateTime.Now;
                }

                // YÖNETİM KURULU'nu GENEL KURUL'un altına yerleştir
                var yonetimKurulu = await _context.OrganizationCharts.FindAsync(2);
                if (yonetimKurulu != null)
                {
                    yonetimKurulu.ParentId = 1; // GENEL KURUL
                    yonetimKurulu.Order = 1;
                    yonetimKurulu.UpdatedAt = DateTime.Now;
                }

                // SEKTÖR KURULLARI'ni GENEL SEKRETER'in altına yerleştir
                var sektorKurullari = await _context.OrganizationCharts.FindAsync(7);
                if (sektorKurullari != null)
                {
                    sektorKurullari.ParentId = 5; // GENEL SEKRETER
                    sektorKurullari.Order = 1;
                    sektorKurullari.UpdatedAt = DateTime.Now;
                }

                // KOMİSYONLAR'ı GENEL SEKRETER'in altına yerleştir
                var komisyonlar = await _context.OrganizationCharts.FindAsync(8);
                if (komisyonlar != null)
                {
                    komisyonlar.ParentId = 5; // GENEL SEKRETER
                    komisyonlar.Order = 2;
                    komisyonlar.UpdatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Hiyerarşi başarıyla düzeltildi" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"FixHierarchy error: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}