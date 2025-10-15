using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class Commission
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string Chairman { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string ViceChairman { get; set; } = string.Empty;
        
        public string? Members { get; set; } // JSON string olarak üye listesi
        
        public string? ImageUrl { get; set; }
        
        public int Order { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? UpdatedAt { get; set; }
    }
}
