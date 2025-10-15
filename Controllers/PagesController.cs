using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var pages = await _context.Pages
                    .AsNoTracking()
                    .Where(p => p.IsActive)
                    .OrderBy(p => p.Order)
                    .ThenBy(p => p.Title)
                    .Select(p => new {
                        p.Id,
                        p.Title,
                        p.Content,
                        p.Slug,
                        p.IsActive,
                        p.Order,
                        p.ParentId,
                        p.Template,
                        p.ImageUrl
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = pages });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAll pages error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Sayfalar yüklenirken hata oluştu" });
            }
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            try
            {
                var page = await _context.Pages
                    .AsNoTracking()
                    .Where(p => p.Slug == slug && p.IsActive)
                    .Select(p => new {
                        p.Id,
                        p.Title,
                        p.Content,
                        p.Slug,
                        p.IsActive,
                        p.Order,
                        p.ParentId,
                        p.Template,
                        p.ImageUrl
                    })
                    .FirstOrDefaultAsync();

                if (page == null)
                    return NotFound(new { success = false, message = "Sayfa bulunamadı" });

                return Ok(new { success = true, data = page });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetBySlug error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Sayfa yüklenirken hata oluştu" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Page page)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Geçersiz veri" });

            _context.Pages.Add(page);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = page });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Page page)
        {
            try
            {
                var existingPage = await _context.Pages.FindAsync(id);
                if (existingPage == null)
                    return NotFound(new { success = false, message = "Sayfa bulunamadı" });

                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Geçersiz veri" });

                // Debug log
                Console.WriteLine($"Updating page {id}:");
                Console.WriteLine($"Old slug: {existingPage.Slug}");
                Console.WriteLine($"New slug: {page.Slug}");

                // Update properties
                existingPage.Title = page.Title;
                existingPage.Content = page.Content;
                existingPage.Slug = page.Slug;
                existingPage.IsActive = page.IsActive;
                existingPage.Order = page.Order;
                existingPage.ParentId = page.ParentId;
                existingPage.Template = page.Template;
                existingPage.ImageUrl = page.ImageUrl;

                await _context.SaveChangesAsync();

                Console.WriteLine($"Updated slug: {existingPage.Slug}");

                return Ok(new { success = true, data = existingPage });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var page = await _context.Pages.FindAsync(id);
            if (page == null)
                return NotFound(new { success = false, message = "Sayfa bulunamadı" });

            _context.Pages.Remove(page);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}
