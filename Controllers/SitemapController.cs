using System.Text;
using System.Xml.Linq;
using KurumsalSite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KurumsalSite.Controllers
{
    [ApiController]
    public class SitemapController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public SitemapController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        [Route("sitemap.xml")]
        public async Task<IActionResult> GetSitemap()
        {
            var xml = await GenerateSitemapXml();
            var bytes = Encoding.UTF8.GetBytes(xml);
            return File(bytes, "application/xml; charset=utf-8");
        }

        [HttpPost]
        [Route("api/sitemap/regenerate")]
        public async Task<IActionResult> RegenerateSitemapFile()
        {
            var xml = await GenerateSitemapXml();
            var webRoot = _env.WebRootPath;
            var targetPath = Path.Combine(webRoot, "sitemap.xml");
            await System.IO.File.WriteAllTextAsync(targetPath, xml, Encoding.UTF8);
            return Ok(new { success = true, path = "/sitemap.xml" });
        }

        private async Task<string> GenerateSitemapXml()
        {
            // Her zaman production domain'ini kullan
            var baseUrl = "https://kurumsalwebsitesi.com";

            // Collect URLs from active menu (including active children)
            var menuItems = await _context.MenuItems
                .Include(m => m.Children.Where(c => c.IsActive))
                .Where(m => m.IsActive)
                .ToListAsync();

            var urls = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "/"
            };

            foreach (var item in menuItems)
            {
                AddMenuUrlRecursive(item, urls);
            }

            // Also add active pages (in case some are not attached to menu)
            var pages = await _context.Pages
                .Where(p => p.IsActive)
                .ToListAsync();
            foreach (var p in pages)
            {
                var path = $"/{p.Slug}".Replace("//", "/");
                urls.Add(path);
            }

            // Build XML
            XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
            var urlset = new XElement(ns + "urlset");
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

            foreach (var path in urls.OrderBy(u => u))
            {
                var loc = path.StartsWith("http", StringComparison.OrdinalIgnoreCase) ? path : baseUrl.TrimEnd('/') + path;
                var (changefreq, priority) = GetSeoMetaForPath(path);

                urlset.Add(new XElement(ns + "url",
                    new XElement(ns + "loc", loc),
                    new XElement(ns + "lastmod", today),
                    new XElement(ns + "changefreq", changefreq),
                    new XElement(ns + "priority", priority)
                ));
            }

            var doc = new XDocument(new XDeclaration("1.0", "UTF-8", null), urlset);
            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private static void AddMenuUrlRecursive(MenuItem item, HashSet<string> urls)
        {
            if (!string.IsNullOrWhiteSpace(item.Url))
            {
                var normalized = item.Url.StartsWith("/") ? item.Url : "/" + item.Url;
                urls.Add(normalized.Replace("//", "/"));
            }

            if (item.Children == null || item.Children.Count == 0)
                return;

            foreach (var child in item.Children.Where(c => c.IsActive).OrderBy(c => c.Order))
            {
                AddMenuUrlRecursive(child, urls);
            }
        }

        private static (string changefreq, string priority) GetSeoMetaForPath(string path)
        {
            var p = path.Trim('/').ToLowerInvariant();
            if (string.IsNullOrEmpty(p)) return ("daily", "1.0"); // homepage

            // Custom weights for key sections
            if (p.Contains("haber")) return ("daily", "0.9");
            if (p.Contains("hakk")) return ("weekly", "0.9");
            if (p.Contains("ilet")) return ("monthly", "0.7");
            if (p.Contains("kurul") || p.Contains("komisyon")) return ("weekly", "0.8");

            return ("weekly", "0.8");
        }
    }
}


