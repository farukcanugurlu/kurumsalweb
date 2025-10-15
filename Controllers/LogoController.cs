using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LogoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var logos = await _context.Logos
                    .OrderBy(l => l.Type)
                    .ThenBy(l => l.Name)
                    .ToListAsync();

                return Ok(new { success = true, data = logos });
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
                var logo = await _context.Logos.FindAsync(id);
                if (logo == null)
                {
                    return NotFound(new { success = false, message = "Logo bulunamadı" });
                }

                return Ok(new { success = true, data = logo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("by-type/{type}")]
        public async Task<IActionResult> GetByType(string type)
        {
            try
            {
                var logo = await _context.Logos
                    .Where(l => l.Type == type)
                    .FirstOrDefaultAsync();

                if (logo == null)
                {
                    return NotFound(new { success = false, message = $"{type} tipinde logo bulunamadı" });
                }

                return Ok(new { success = true, data = logo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("test-update")]
        public async Task<IActionResult> TestUpdate([FromBody] Logo logo)
        {
            try
            {
                Console.WriteLine($"Test Update - Logo: {logo?.Name}, ImageUrl: {logo?.ImageUrl}");
                
                // Test if we can create a new logo with the same data
                var testLogo = new Logo
                {
                    Name = logo?.Name ?? "Test",
                    ImageUrl = logo?.ImageUrl ?? "test.jpg",
                    AltText = logo?.AltText,
                    Type = logo?.Type ?? "header",
                    Width = logo?.Width ?? 150,
                    Height = logo?.Height ?? 50,
                    IsActive = logo?.IsActive ?? true
                };

                _context.Logos.Add(testLogo);
                await _context.SaveChangesAsync();
                
                // Remove the test logo
                _context.Logos.Remove(testLogo);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Test update successful", data = logo });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Test Update error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { 
                    success = false, 
                    message = ex.Message,
                    details = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Logo logo)
        {
            try
            {
                logo.CreatedAt = DateTime.Now;
                _context.Logos.Add(logo);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = logo, message = "Logo başarıyla oluşturuldu" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Logo logo)
        {
            try
            {
                Console.WriteLine($"Update Logo request - ID: {id}, Name: {logo?.Name}");
                Console.WriteLine($"Logo data: Name={logo?.Name}, ImageUrl={logo?.ImageUrl}, Type={logo?.Type}, Width={logo?.Width}, Height={logo?.Height}");
                
                if (logo == null)
                    return BadRequest(new { success = false, message = "Logo bilgisi boş olamaz" });

                // Validate required fields
                if (string.IsNullOrEmpty(logo.Name))
                    return BadRequest(new { success = false, message = "Logo adı gerekli" });
                
                if (string.IsNullOrEmpty(logo.ImageUrl))
                    return BadRequest(new { success = false, message = "Logo resmi gerekli" });

                var existingLogo = await _context.Logos.FindAsync(id);
                if (existingLogo == null)
                {
                    Console.WriteLine($"Logo with ID {id} not found");
                    return NotFound(new { success = false, message = $"ID {id} olan logo bulunamadı" });
                }

                Console.WriteLine($"Updating Logo: {existingLogo.Name} -> {logo.Name}");
                Console.WriteLine($"Existing ImageUrl: {existingLogo.ImageUrl}");
                Console.WriteLine($"New ImageUrl: {logo.ImageUrl}");
                
                existingLogo.Name = logo.Name;
                existingLogo.ImageUrl = logo.ImageUrl;
                existingLogo.AltText = logo.AltText;
                existingLogo.Type = logo.Type;
                existingLogo.Width = logo.Width;
                existingLogo.Height = logo.Height;
                existingLogo.IsActive = logo.IsActive;
                existingLogo.UpdatedAt = DateTime.Now;

                Console.WriteLine($"About to save changes...");
                await _context.SaveChangesAsync();

                Console.WriteLine($"Logo {id} updated successfully");
                return Ok(new { success = true, data = existingLogo, message = "Logo başarıyla güncellendi" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Update Logo error: {ex.Message}");
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var logo = await _context.Logos.FindAsync(id);
                if (logo == null)
                {
                    return NotFound(new { success = false, message = "Logo bulunamadı" });
                }

                _context.Logos.Remove(logo);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Logo başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}