using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KurumsalSite.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Url { get; set; } = string.Empty;
        
        public int Order { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        public int? ParentId { get; set; }
        
        [JsonIgnore]
        public MenuItem? Parent { get; set; }
        
        public ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();
    }
}
