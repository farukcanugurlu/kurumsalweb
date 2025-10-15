using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using KurumsalSite.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// React build çıktısını publish ederken kullanabilmek için
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "frontend/build";
});

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .EnableSensitiveDataLogging()
           .EnableDetailedErrors()
           .LogTo(Console.WriteLine, LogLevel.Information));

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS - Her host'tan erişime izin ver
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure CORS early
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
// Swagger'ı hem Development hem Production'da aktif et
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    // Production'da da detaylı hata göster
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseRouting();

app.UseAuthorization();

// API route'larını önce tanımla
// API test endpoint
app.MapGet("/api/test", () => new { 
    message = "API çalışıyor!", 
    timestamp = DateTime.Now,
    environment = app.Environment.EnvironmentName
});

app.MapControllers();

// SPA için catch-all route (en sona koy)
app.MapFallbackToFile("index.html");

// React dev-server veya build alınmış dosyaları bağla
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "frontend";
    
    // Development'da da build edilmiş dosyaları kullan
    // Bu şekilde React dev server'a gerek yok
});

app.Run();
