# Dernek Web Projesi

Bu proje, dernekler için dinamik içerik yönetim sistemi sağlayan bir web uygulamasıdır.

## Teknolojiler

### Backend
- .NET 8
- Entity Framework Core
- SQL Server
- Web API
- Swagger

### Frontend
- React 18
- TypeScript
- Ant Design
- Axios

## Kurulum

### Gereksinimler
- .NET 8 SDK
- Node.js 18+
- SQL Server

### Adımlar

1. **Backend bağımlılıklarını yükleyin:**
   ```bash
   dotnet restore
   ```

2. **Frontend bağımlılıklarını yükleyin:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Veritabanını oluşturun:**
   ```bash
   dotnet ef database update
   ```

## Çalıştırma

### Otomatik Başlatma
```bash
start.bat
```

### Manuel Başlatma

1. **Backend:**
   ```bash
   dotnet run
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

## Erişim Adresleri

- **Backend API:** http://localhost:5250
- **Swagger:** http://localhost:5250/swagger
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/yonetim

## Admin Panel Özellikleri

- **Dashboard:** Genel istatistikler
- **Haberler:** Haber ekleme, düzenleme, silme
- **Sayfalar:** Dinamik sayfa yönetimi
- **Menü:** Navigasyon menüsü yönetimi
- **Organizasyon:** Üye yönetimi
- **İletişim:** İletişim bilgileri yönetimi

## Veritabanı

Proje SQL Server kullanır. Connection string `appsettings.json` dosyasında tanımlıdır.

Migration history tablosu (`__EFMigrationsHistory`) tüm değişiklikleri kaydeder.

## Geliştirme

- Backend: Visual Studio veya VS Code
- Frontend: VS Code önerilir
- Veritabanı: SQL Server Management Studio (SSMS)
