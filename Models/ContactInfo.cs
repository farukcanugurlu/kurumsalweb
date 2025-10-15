using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class ContactInfo
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // phone, email, address, social
        
        [Required]
        [StringLength(200)]
        public string Value { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Label { get; set; } = string.Empty;
        
        // Sosyal medya için URL alanı
        [StringLength(500)]
        public string? Url { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Harita koordinatları (sadece address type için kullanılır)
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
    }
}
