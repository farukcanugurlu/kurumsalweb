using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo()
        {
            var contactInfos = await _context.ContactInfos
                .Where(c => c.IsActive)
                .ToListAsync();

            return Ok(new { success = true, data = contactInfos });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateInfo([FromBody] List<ContactInfo> contactInfos)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Geçersiz veri" });

            try
            {
                foreach (var info in contactInfos)
                {
                    if (info.Id == 0)
                    {
                        // Yeni kayıt ekle
                        _context.ContactInfos.Add(info);
                    }
                    else
                    {
                        // Mevcut kaydı güncelle
                        var existingInfo = await _context.ContactInfos.FindAsync(info.Id);
                        if (existingInfo != null)
                        {
                            existingInfo.Type = info.Type;
                            existingInfo.Value = info.Value;
                            existingInfo.Label = info.Label;
                            existingInfo.Url = info.Url;
                            existingInfo.IsActive = info.IsActive;
                            existingInfo.Latitude = info.Latitude;
                            existingInfo.Longitude = info.Longitude;
                        }
                    }
                }

                await _context.SaveChangesAsync();

                // Güncellenmiş verileri döndür
                var updatedInfos = await _context.ContactInfos
                    .Where(c => c.IsActive)
                    .ToListAsync();

                return Ok(new { success = true, data = updatedInfos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
