using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalSite.Models;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommissionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommissionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var commissions = await _context.Commissions
                .Where(c => c.IsActive)
                .OrderBy(c => c.Order)
                .ToListAsync();

            return Ok(new { success = true, data = commissions });
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var commissions = await _context.Commissions
                .OrderBy(c => c.Order)
                .ToListAsync();

            return Ok(new { success = true, data = commissions });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var commission = await _context.Commissions.FindAsync(id);
            if (commission == null)
                return NotFound(new { success = false, message = "Komisyon bulunamadı" });

            return Ok(new { success = true, data = commission });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Commission commission)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Geçersiz veri" });

            commission.CreatedAt = DateTime.Now;
            _context.Commissions.Add(commission);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = commission });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Commission commission)
        {
            try
            {
                if (id != commission.Id)
                    return BadRequest(new { success = false, message = "ID uyuşmazlığı" });

                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                    return BadRequest(new { success = false, message = $"Geçersiz veri: {errors}" });
                }

                var existingCommission = await _context.Commissions.FindAsync(id);
                if (existingCommission == null)
                    return NotFound(new { success = false, message = "Komisyon bulunamadı" });

                // Update properties
                existingCommission.Name = commission.Name;
                existingCommission.Description = commission.Description;
                existingCommission.Chairman = commission.Chairman;
                existingCommission.ViceChairman = commission.ViceChairman;
                existingCommission.Members = commission.Members;
                existingCommission.ImageUrl = commission.ImageUrl;
                existingCommission.Order = commission.Order;
                existingCommission.IsActive = commission.IsActive;
                existingCommission.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingCommission });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var commission = await _context.Commissions.FindAsync(id);
            if (commission == null)
                return NotFound(new { success = false, message = "Komisyon bulunamadı" });

            _context.Commissions.Remove(commission);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}
