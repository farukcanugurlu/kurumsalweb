using Microsoft.EntityFrameworkCore;

namespace KurumsalSite.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<News> News { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<OrganizationMember> OrganizationMembers { get; set; }
        public DbSet<Commission> Commissions { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }
        public DbSet<HeroSlide> HeroSlides { get; set; }
        public DbSet<Statistic> Statistics { get; set; }
        public DbSet<Logo> Logos { get; set; }
        public DbSet<OrganizationSettings> OrganizationSettings { get; set; }
        public DbSet<OrganizationChart> OrganizationCharts { get; set; }
        public DbSet<WebsiteAnalytics> WebsiteAnalytics { get; set; }
        public DbSet<AnalyticsSummary> AnalyticsSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Page self-referencing relationship
            modelBuilder.Entity<Page>()
                .HasOne(p => p.Parent)
                .WithMany(p => p.Children)
                .HasForeignKey(p => p.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // MenuItem self-referencing relationship
            modelBuilder.Entity<MenuItem>()
                .HasOne(m => m.Parent)
                .WithMany(m => m.Children)
                .HasForeignKey(m => m.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // OrganizationChart self-referencing relationship
            modelBuilder.Entity<OrganizationChart>()
                .HasOne(o => o.Parent)
                .WithMany(o => o.Children)
                .HasForeignKey(o => o.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique constraints
            modelBuilder.Entity<Page>()
                .HasIndex(p => p.Slug)
                .IsUnique();

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed default pages
            modelBuilder.Entity<Page>().HasData(
                new Page { Id = 1, Title = "Anasayfa", Content = "Kurumsal web sitesi anasayfa içeriği", Slug = "anasayfa", IsActive = true, Order = 1 },
                new Page { Id = 2, Title = "Hakkımızda", Content = "Kurumsal web sitesi hakkında bilgiler", Slug = "hakkimizda", IsActive = true, Order = 2 },
                new Page { Id = 3, Title = "Organizasyon", Content = "Organizasyon yapısı", Slug = "organizasyon", IsActive = true, Order = 3 },
                new Page { Id = 4, Title = "İletişim", Content = "İletişim bilgileri", Slug = "iletisim", IsActive = true, Order = 4 }
            );

            // Seed default menu items
            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem { Id = 1, Title = "Anasayfa", Url = "/", IsActive = true, Order = 1 },
                new MenuItem { Id = 2, Title = "Hakkımızda", Url = "/hakkimizda", IsActive = true, Order = 2 },
                new MenuItem { Id = 3, Title = "Organizasyon", Url = "/organizasyon", IsActive = true, Order = 3 },
                new MenuItem { Id = 4, Title = "Haberler", Url = "/haberler", IsActive = true, Order = 4 },
                new MenuItem { Id = 5, Title = "İletişim", Url = "/iletisim", IsActive = true, Order = 5 }
            );

            // Seed default contact info
            modelBuilder.Entity<ContactInfo>().HasData(
                new ContactInfo { Id = 1, Type = "address", Value = "Örnek Adres, Şehir", Label = "Adres", IsActive = true },
                new ContactInfo { Id = 2, Type = "phone", Value = "+90 312 000 00 00", Label = "Telefon", IsActive = true },
                new ContactInfo { Id = 3, Type = "email", Value = "info@kurumsalwebsitesi.com", Label = "E-posta", IsActive = true }
            );

            // Seed default statistics
            modelBuilder.Entity<Statistic>().HasData(
                new Statistic { Id = 1, Title = "Aktif Üye", Value = 150, Icon = "UserOutlined", Color = "#1e3a8a", Order = 1, IsActive = true },
                new Statistic { Id = 2, Title = "Yıllık Etkinlik", Value = 25, Icon = "CalendarOutlined", Color = "#0ea5e9", Order = 2, IsActive = true },
                new Statistic { Id = 3, Title = "Tamamlanan Proje", Value = 12, Icon = "RightOutlined", Color = "#6366f1", Order = 3, IsActive = true },
                new Statistic { Id = 4, Title = "Kuruluş Yılı", Value = 2010, Icon = "", Color = "#64748b", Order = 4, IsActive = true }
            );
        }
    }
}
