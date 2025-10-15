using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class News
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        // İçerik zorunlu değildir; özet yeterlidir
        public string Content { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Summary { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public DateTime PublishDate { get; set; } = DateTime.Now;
        
        public bool IsActive { get; set; } = true;
        
        [StringLength(50)]
        public string Category { get; set; } = "Genel";
    }
}
