using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public enum PageTemplate
    {
        Default = 0,
        Contact = 1,
        Information = 2,
        Blog = 3,
        Gallery = 4,
        Services = 5,
        About = 6,
        PresidentsMessage = 7
    }

    public class Page
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Content { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Slug { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public int Order { get; set; } = 0;
        
        public int? ParentId { get; set; }
        
        public PageTemplate Template { get; set; } = PageTemplate.Default;
        
        public string? ImageUrl { get; set; }
        
        public Page? Parent { get; set; }
        
        public ICollection<Page> Children { get; set; } = new List<Page>();
    }
}
