using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class Logo
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? AltText { get; set; }
        
        [StringLength(50)]
        public string Type { get; set; } = "header"; // header, footer, favicon
        
        public int Width { get; set; } = 150;
        
        public int Height { get; set; } = 50;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? UpdatedAt { get; set; }
    }
}
