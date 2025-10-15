using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrganizationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("members")]
        public async Task<IActionResult> GetMembers()
        {
            try
            {
                var members = await _context.OrganizationMembers
                    .AsNoTracking() // Read-only için optimize et
                    .OrderBy(m => m.Order)
                    .ThenBy(m => m.Name)
                    .Select(m => new {
                        m.Id,
                        m.Name,
                        m.Position,
                        m.Department,
                        m.ImageUrl,
                        m.Bio,
                        m.Order,
                        m.Category
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = members });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetMembers error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Üyeler yüklenirken hata oluştu" });
            }
        }

        [HttpPost("members")]
        public async Task<IActionResult> CreateMember([FromBody] OrganizationMember member)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Geçersiz veri" });

            _context.OrganizationMembers.Add(member);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = member });
        }

        [HttpPut("members/{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] OrganizationMember member)
        {
            try
            {
                Console.WriteLine($"Update Member request - ID: {id}, Member ID: {member?.Id}, Name: {member?.Name}");
                
                if (member == null)
                    return BadRequest(new { success = false, message = "Member bilgisi boş olamaz" });
                
                if (id != member.Id)
                    return BadRequest(new { success = false, message = $"ID uyuşmazlığı: URL ID ({id}) != Body ID ({member.Id})" });

                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                    return BadRequest(new { success = false, message = $"Geçersiz veri: {errors}" });
                }

                var existingMember = await _context.OrganizationMembers.FindAsync(id);
                if (existingMember == null)
                    return NotFound(new { success = false, message = "Üye bulunamadı" });

                // Update properties
                existingMember.Name = member.Name;
                existingMember.Position = member.Position;
                existingMember.Department = member.Department;
                existingMember.ImageUrl = member.ImageUrl;
                existingMember.Bio = member.Bio;
                existingMember.Order = member.Order;
                existingMember.Category = member.Category;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingMember });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("members/{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            try
            {
                Console.WriteLine($"Delete Member request - ID: {id}");
                
                var member = await _context.OrganizationMembers.FindAsync(id);
                if (member == null)
                {
                    Console.WriteLine($"Member with ID {id} not found");
                    return NotFound(new { success = false, message = "Üye bulunamadı" });
                }

                Console.WriteLine($"Deleting Member: {member.Name} (ID: {member.Id})");
                _context.OrganizationMembers.Remove(member);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Member {id} deleted successfully");
                return Ok(new { success = true, message = "Üye başarıyla silindi" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Delete Member error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                // Return more detailed error information for debugging
                var errorMessage = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { 
                    success = false, 
                    message = errorMessage,
                    details = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("scheme")]
        public async Task<IActionResult> GetOrganizationScheme()
        {
            try
            {
                var settings = await _context.OrganizationSettings
                    .AsNoTracking()
                    .Where(s => (s.Key == "scheme_url" || s.Key == "scheme_description") && s.IsActive)
                    .Select(s => new { s.Key, s.Value })
                    .ToListAsync();

                var schemeUrl = settings.FirstOrDefault(s => s.Key == "scheme_url")?.Value ?? "";
                var description = settings.FirstOrDefault(s => s.Key == "scheme_description")?.Value ?? "Organizasyon şeması henüz eklenmedi";

                var schemeInfo = new { 
                    hasOrganogram = !string.IsNullOrEmpty(schemeUrl), 
                    schemeUrl, 
                    description
                };
                
                return Ok(new { success = true, data = schemeInfo });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetOrganizationScheme error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Şema bilgileri yüklenirken hata oluştu" });
            }
        }

        [HttpPost("scheme")]
        public async Task<IActionResult> SetOrganizationScheme([FromBody] SchemeRequest request)
        {
            try
            {
                Console.WriteLine($"Setting scheme data: SchemeUrl={request.SchemeUrl}, Description={request.Description}");
                
                // Scheme URL'yi kaydet veya güncelle
                var schemeSettings = await _context.OrganizationSettings
                    .Where(s => s.Key == "scheme_url")
                    .FirstOrDefaultAsync();

                if (schemeSettings == null)
                {
                    schemeSettings = new OrganizationSettings 
                    { 
                        Key = "scheme_url", 
                        IsActive = true 
                    };
                    _context.OrganizationSettings.Add(schemeSettings);
                }

                schemeSettings.Value = request.SchemeUrl ?? "";
                schemeSettings.UpdatedAt = DateTime.Now;

                // Scheme Description'ı kaydet veya güncelle
                var descriptionSettings = await _context.OrganizationSettings
                    .Where(s => s.Key == "scheme_description")
                    .FirstOrDefaultAsync();

                if (descriptionSettings == null)
                {
                    descriptionSettings = new OrganizationSettings 
                    { 
                        Key = "scheme_description", 
                        IsActive = true 
                    };
                    _context.OrganizationSettings.Add(descriptionSettings);
                }

                descriptionSettings.Value = request.Description ?? "";
                descriptionSettings.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Organizasyon şeması ayarlandı" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Scheme save error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        public class SchemeRequest
        {
            public string? SchemeUrl { get; set; }
            public string? Description { get; set; }
        }
    }
}
