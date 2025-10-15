using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class HeroSlide
    {
        public int Id { get; set; }
        
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? ButtonText { get; set; }
        
        [StringLength(200)]
        public string? ButtonLink { get; set; }
        
        public int Order { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        [StringLength(20)]
        public string? BackgroundColor { get; set; }
        
        [StringLength(20)]
        public string? TextColor { get; set; }
    }
}
