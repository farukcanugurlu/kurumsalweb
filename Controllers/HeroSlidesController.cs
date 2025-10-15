using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HeroSlidesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HeroSlidesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var slides = await _context.HeroSlides
                    .OrderBy(s => s.Order)
                    .ToListAsync();

                return Ok(new { success = true, data = slides });
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
                var slide = await _context.HeroSlides.FindAsync(id);
                if (slide == null)
                {
                    return NotFound(new { success = false, message = "Slide bulunamadı" });
                }

                return Ok(new { success = true, data = slide });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HeroSlide slide)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Geçersiz veri", errors = ModelState });
                }

                _context.HeroSlides.Add(slide);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = slide.Id }, new { success = true, data = slide });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HeroSlide slide)
        {
            try
            {
                if (id != slide.Id)
                {
                    return BadRequest(new { success = false, message = "ID uyuşmazlığı" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Geçersiz veri", errors = ModelState });
                }

                // Önce kayıt var mı kontrol et
                var existingSlide = await _context.HeroSlides.FindAsync(id);
                if (existingSlide == null)
                {
                    return NotFound(new { success = false, message = "Slide bulunamadı" });
                }

                // Mevcut kaydı güncelle
                existingSlide.Title = slide.Title;
                existingSlide.Description = slide.Description;
                existingSlide.ImageUrl = slide.ImageUrl;
                existingSlide.ButtonText = slide.ButtonText;
                existingSlide.ButtonLink = slide.ButtonLink;
                existingSlide.Order = slide.Order;
                existingSlide.IsActive = slide.IsActive;
                existingSlide.BackgroundColor = slide.BackgroundColor;
                existingSlide.TextColor = slide.TextColor;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingSlide });
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
                Console.WriteLine($"Delete HeroSlide request - ID: {id}");
                
                var slide = await _context.HeroSlides.FindAsync(id);
                if (slide == null)
                {
                    Console.WriteLine($"HeroSlide with ID {id} not found");
                    return NotFound(new { success = false, message = $"ID {id} olan slide bulunamadı" });
                }

                Console.WriteLine($"Deleting HeroSlide: {slide.Title}");
                _context.HeroSlides.Remove(slide);
                await _context.SaveChangesAsync();

                Console.WriteLine($"HeroSlide {id} deleted successfully");
                return Ok(new { success = true, message = "Slide başarıyla silindi" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Delete HeroSlide error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> Reorder([FromBody] ReorderRequest request)
        {
            try
            {
                foreach (var item in request.Slides)
                {
                    var slide = await _context.HeroSlides.FindAsync(item.Id);
                    if (slide != null)
                    {
                        slide.Order = item.Order;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Sıralama güncellendi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class ReorderRequest
    {
        public List<ReorderItem> Slides { get; set; } = new();
    }

    public class ReorderItem
    {
        public int Id { get; set; }
        public int Order { get; set; }
    }
}
