using Microsoft.AspNetCore.Mvc;

namespace KurumsalSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public FileUploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            try
            {
                Console.WriteLine($"Upload request - FileName: {file?.FileName}, ContentType: {file?.ContentType}, Length: {file?.Length}");
                Console.WriteLine($"File extension: {Path.GetExtension(file?.FileName)}, isPDF: {file?.FileName?.ToLower().EndsWith(".pdf")}");
                
                if (file == null || file.Length == 0)
                {
                    Console.WriteLine("ERROR: File is null or empty");
                    return BadRequest(new { success = false, message = "Dosya seçilmedi" });
                }

                // Dosya türü kontrolü
                var imageTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                var pdfTypes = new[] { "application/pdf" }; // PDF
                var allAllowedTypes = imageTypes.Concat(pdfTypes).ToArray();
                
                Console.WriteLine($"File contentType: '{file.ContentType}', Allowed types: [{string.Join(", ", allAllowedTypes)}]");
                Console.WriteLine($"Is contentType allowed: {allAllowedTypes.Contains(file.ContentType.ToLower())}");
                Console.WriteLine($"Is PDF by extension: {file.FileName.ToLower().EndsWith(".pdf")}");
                
                if (!allAllowedTypes.Contains(file.ContentType.ToLower()) && 
                    !file.FileName.ToLower().EndsWith(".pdf"))
                {
                    Console.WriteLine($"ERROR: File type not allowed - ContentType: '{file.ContentType}', Extension: '{Path.GetExtension(file.FileName)}'");
                    return BadRequest(new { 
                        success = false, 
                        message = $"Dosya türü desteklenmiyor. ContentType: '{file.ContentType}', Uzantı: '{Path.GetExtension(file.FileName)}'" 
                    });
                }

                // Dosya boyutu kontrolü - PDF için 5MB, resimler için 5MB
                int maxSize = 5 * 1024 * 1024; // 5MB for all files
                
                Console.WriteLine($"File size: {file.Length} bytes ({file.Length / (1024 * 1024)}MB), Max size: {maxSize} bytes ({maxSize / (1024 * 1024)}MB)");
                    
                if (file.Length > maxSize)
                {
                    var sizeLimitMB = maxSize / (1024 * 1024);
                    var actualSizeMB = file.Length / (1024 * 1024);
                    Console.WriteLine($"ERROR: File too large - Actual: {actualSizeMB}MB, Limit: {sizeLimitMB}MB");
                    return BadRequest(new { 
                        success = false, 
                        message = $"Dosya boyutu {sizeLimitMB}MB'dan küçük olmalıdır (Şu anki boyut: {actualSizeMB}MB)" 
                    });
                }

                // Uploads klasörünü oluştur
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Benzersiz dosya adı oluştur
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);

                Console.WriteLine($"Saving file to: {filePath}");
                
                // Dosyayı kaydet
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                Console.WriteLine($"File saved successfully: {fileName}");
                
                // URL'yi döndür
                var fileUrl = $"/uploads/{fileName}";

                Console.WriteLine($"Returning URL: {fileUrl}");

                return Ok(new { 
                    success = true, 
                    data = new { 
                        url = fileUrl,
                        fileName = fileName,
                        originalName = file.FileName,
                        size = file.Length
                    } 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("delete")]
        public IActionResult DeleteFile([FromBody] DeleteFileRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.FileName))
                {
                    return BadRequest(new { success = false, message = "Dosya adı gerekli" });
                }

                var filePath = Path.Combine(_environment.WebRootPath, "uploads", request.FileName);
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { success = true, message = "Dosya silindi" });
                }
                else
                {
                    return NotFound(new { success = false, message = "Dosya bulunamadı" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class DeleteFileRequest
    {
        public string FileName { get; set; } = string.Empty;
    }
}
