using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class OrganizationMember
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Position { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Department { get; set; } = string.Empty;
        
        public string? ImageUrl { get; set; }
        
        public string? Bio { get; set; }
        
        public int Order { get; set; } = 0;
        
        [StringLength(50)]
        public string Category { get; set; } = "other"; // board, commission, other
    }
}
