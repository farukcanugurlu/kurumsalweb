using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var news = await _context.News
                    .AsNoTracking()
                    .Where(n => n.IsActive)
                    .OrderByDescending(n => n.PublishDate)
                    .Select(n => new {
                        n.Id,
                        n.Title,
                        n.Summary,
                        n.ImageUrl,
                        n.PublishDate,
                        n.Category,
                        n.IsActive
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = news });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAll news error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Haberler yüklenirken hata oluştu" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null)
                return NotFound(new { success = false, message = "Haber bulunamadı" });

            return Ok(new { success = true, data = news });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] News news)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Geçersiz veri" });

            _context.News.Add(news);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = news });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] News news)
        {
            try
            {
                // Postman ile test edilebilecek debug bilgisi
                Console.WriteLine($"Update request - ID: {id}, News ID: {news.Id}, Title: {news.Title}");
                
                if (id != news.Id)
                    return BadRequest(new { success = false, message = $"ID uyuşmazlığı: URL ID ({id}) != Body ID ({news.Id})" });

                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                    return BadRequest(new { success = false, message = $"Geçersiz veri: {errors}" });
                }

                var existingNews = await _context.News.FindAsync(id);
                if (existingNews == null)
                    return NotFound(new { success = false, message = "Haber bulunamadı" });

                // Update properties
                existingNews.Title = news.Title;
                existingNews.Content = news.Content;
                existingNews.Summary = news.Summary;
                existingNews.ImageUrl = news.ImageUrl;
                existingNews.IsActive = news.IsActive;
                existingNews.PublishDate = news.PublishDate;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingNews });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null)
                return NotFound(new { success = false, message = "Haber bulunamadı" });

            _context.News.Remove(news);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}
