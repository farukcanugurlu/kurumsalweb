using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KurumsalSite.Models
{
    public class WebsiteAnalytics
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int PageViews { get; set; }

        [Required]
        public int UniqueVisitors { get; set; }

        [Required]
        public int Sessions { get; set; }

        [Required]
        public double BounceRate { get; set; }

        [Required]
        public double AverageSessionDuration { get; set; }

        [Required]
        public string PageUrl { get; set; } = string.Empty;

        [Required]
        public string Referrer { get; set; } = string.Empty;

        [Required]
        public string UserAgent { get; set; } = string.Empty;

        [Required]
        public string IpAddress { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string DeviceType { get; set; } = string.Empty; // desktop, mobile, tablet

        [Required]
        public string Browser { get; set; } = string.Empty;

        [Required]
        public string OperatingSystem { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }

    public class AnalyticsSummary
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Period { get; set; } = string.Empty; // daily, weekly, monthly, yearly

        [Required]
        public int TotalPageViews { get; set; }

        [Required]
        public int TotalUniqueVisitors { get; set; }

        [Required]
        public int TotalSessions { get; set; }

        [Required]
        public double AverageBounceRate { get; set; }

        [Required]
        public double AverageSessionDuration { get; set; }

        [Required]
        public int NewVisitors { get; set; }

        [Required]
        public int ReturningVisitors { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
