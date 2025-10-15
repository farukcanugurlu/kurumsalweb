using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MenuController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var menuItems = await _context.MenuItems
                .Include(m => m.Children)
                .Where(m => m.IsActive && m.ParentId == null) // Sadece ana menü öğelerini al
                .OrderBy(m => m.Order)
                .ToListAsync();

            // Alt menü öğelerini Order'a göre sırala (artan)
            foreach (var item in menuItems)
            {
                if (item.Children != null && item.Children.Count > 0)
                {
                    item.Children = item.Children
                        .Where(c => c.IsActive)
                        .OrderBy(c => c.Order)
                        .ToList();
                }
            }

            return Ok(new { success = true, data = menuItems });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MenuItem menuItem)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Geçersiz veri" });

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = menuItem });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MenuItem menuItem)
        {
            try
            {
                Console.WriteLine($"Menu Update - URL ID: {id}, Body ID: {menuItem.Id}, Title: {menuItem.Title}");
                
                if (id != menuItem.Id)
                    return BadRequest(new { 
                        success = false, 
                        message = $"ID uyuşmazlığı: URL ID ({id}) != Body ID ({menuItem.Id})" 
                    });

                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                    return BadRequest(new { 
                        success = false, 
                        message = $"Geçersiz veri: {errors}" 
                    });
                }

                var existingMenuItem = await _context.MenuItems.FindAsync(id);
                if (existingMenuItem == null)
                    return NotFound(new { success = false, message = "Menü öğesi bulunamadı" });

                // Update properties
                existingMenuItem.Title = menuItem.Title;
                existingMenuItem.Url = menuItem.Url;
                existingMenuItem.IsActive = menuItem.IsActive;
                existingMenuItem.Order = menuItem.Order;
                existingMenuItem.ParentId = menuItem.ParentId;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingMenuItem });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
                return NotFound(new { success = false, message = "Menü öğesi bulunamadı" });

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [HttpPost("sync-page/{pageId}")]
        public async Task<IActionResult> SyncPageToMenu(int pageId)
        {
            try
            {
                var page = await _context.Pages.FindAsync(pageId);
                if (page == null)
                    return NotFound(new { success = false, message = "Sayfa bulunamadı" });

                // Sayfa zaten menüde var mı kontrol et
                var existingMenuItem = await _context.MenuItems
                    .FirstOrDefaultAsync(m => m.Url == $"/{page.Slug}");

                if (existingMenuItem != null)
                    return BadRequest(new { success = false, message = "Bu sayfa zaten menüde mevcut" });

                // Yeni menü özelik ekle
                var newMenuItem = new MenuItem
                {
                    Title = page.Title,
                    Url = $"/{page.Slug}",
                    Order = await _context.MenuItems.CountAsync() + 1,
                    IsActive = true
                };

                _context.MenuItems.Add(newMenuItem);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = newMenuItem });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("with-children")]
        public async Task<IActionResult> GetWithChildren()
        {
            var menuItems = await _context.MenuItems
                .Include(m => m.Children.Where(c => c.IsActive))
                .Where(m => m.IsActive)
                .OrderBy(m => m.Order)
                .ToListAsync();

            // Tüm öğelerin alt öğelerini Order'a göre sırala (artan)
            foreach (var item in menuItems)
            {
                if (item.Children != null && item.Children.Count > 0)
                {
                    item.Children = item.Children
                        .OrderBy(c => c.Order)
                        .ToList();
                }
            }

            return Ok(new { success = true, data = menuItems });
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var menuItems = await _context.MenuItems
                .Include(m => m.Children)
                .OrderBy(m => m.Order)
                .ToListAsync();

            // Admin görünümünde de alt öğeleri Order'a göre sırala (artan)
            foreach (var item in menuItems)
            {
                if (item.Children != null && item.Children.Count > 0)
                {
                    item.Children = item.Children
                        .OrderBy(c => c.Order)
                        .ToList();
                }
            }

            return Ok(new { success = true, data = menuItems });
        }
    }
}
