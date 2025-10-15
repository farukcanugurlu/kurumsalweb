using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SiteSettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SiteSettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var settings = await _context.OrganizationSettings
                    .Where(s => s.IsActive)
                    .OrderBy(s => s.Key)
                    .ToListAsync();

                return Ok(new { success = true, data = settings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{key}")]
        public async Task<IActionResult> GetByKey(string key)
        {
            try
            {
                var setting = await _context.OrganizationSettings
                    .Where(s => s.Key == key && s.IsActive)
                    .FirstOrDefaultAsync();

                if (setting == null)
                {
                    return NotFound(new { success = false, message = "Ayar bulunamadı" });
                }

                return Ok(new { success = true, data = setting });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate([FromBody] SiteSettingRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Key))
                {
                    return BadRequest(new { success = false, message = "Ayar anahtarı gerekli" });
                }

                var existingSetting = await _context.OrganizationSettings
                    .Where(s => s.Key == request.Key)
                    .FirstOrDefaultAsync();

                if (existingSetting == null)
                {
                    // Yeni ayar oluştur
                    var newSetting = new OrganizationSettings
                    {
                        Key = request.Key,
                        Value = request.Value,
                        Description = request.Description,
                        IsActive = true,
                        CreatedAt = DateTime.Now
                    };

                    _context.OrganizationSettings.Add(newSetting);
                    await _context.SaveChangesAsync();

                    return Ok(new { success = true, data = newSetting, message = "Ayar oluşturuldu" });
                }
                else
                {
                    // Mevcut ayarı güncelle
                    existingSetting.Value = request.Value;
                    existingSetting.Description = request.Description;
                    existingSetting.UpdatedAt = DateTime.Now;

                    await _context.SaveChangesAsync();

                    return Ok(new { success = true, data = existingSetting, message = "Ayar güncellendi" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(string key)
        {
            try
            {
                var setting = await _context.OrganizationSettings
                    .Where(s => s.Key == key)
                    .FirstOrDefaultAsync();

                if (setting == null)
                {
                    return NotFound(new { success = false, message = "Ayar bulunamadı" });
                }

                _context.OrganizationSettings.Remove(setting);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Ayar silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class SiteSettingRequest
    {
        public string Key { get; set; } = string.Empty;
        public string? Value { get; set; }
        public string? Description { get; set; }
    }
}
