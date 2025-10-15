using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class OrganizationChart
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty; // GENEL KURUL, YÖNETİM KURULU, vs.
        
        public int? ParentId { get; set; } // Hiyerarşik yapı için
        
        public int Order { get; set; } = 0; // Sıralama
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual OrganizationChart? Parent { get; set; }
        public virtual ICollection<OrganizationChart> Children { get; set; } = new List<OrganizationChart>();
    }
}
