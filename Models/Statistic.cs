using System.ComponentModel.DataAnnotations;

namespace KurumsalSite.Models
{
    public class Statistic
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public int Value { get; set; }

        [StringLength(50)]
        public string? Icon { get; set; }

        [StringLength(7)]
        public string? Color { get; set; }

        public int Order { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
