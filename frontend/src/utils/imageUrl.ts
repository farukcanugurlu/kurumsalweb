/**
 * Merkezi görsel URL yardımcı fonksiyonları
 * Tüm görsellerin doğru URL'lerini döndürmek için kullanılır
 */

// Backend API base URL'i - her ortamda dinamik
const getApiBaseUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Eğer port varsa onu da ekle
  const port = window.location.port;
  const portSuffix = port ? `:${port}` : '';
  
  return `${protocol}//${hostname}${portSuffix}`;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Görsel URL'ini tam URL'e çevirir
 * @param imageUrl - Görsel URL'i (/uploads/filename.jpg veya tam URL)
 * @returns Tam URL veya placeholder URL
 */
export const getImageUrl = (imageUrl?: string | null, placeholder?: string): string => {
  if (!imageUrl) {
    return placeholder || 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=Görsel+Yok';
  }

  // Eğer zaten tam URL ise (http/https ile başlıyorsa) değiştirme
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Backend URL'i ile birleştir
  return `${API_BASE_URL}${imageUrl}`;
};

/**
 * Haber görseli için özel URL fonksiyonu
 */
export const getNewsImageUrl = (imageUrl?: string | null): string => {
  return getImageUrl(imageUrl, 'https://via.placeholder.com/300x200/1890ff/ffffff?text=Haber');
};

/**
 * Logo görseli için özel URL fonksiyonu
 */
export const getLogoImageUrl = (imageUrl?: string | null): string => {
  return getImageUrl(imageUrl, 'https://via.placeholder.com/150x50/e5e7eb/9ca3af?text=Logo');
};

/**
 * Üye fotoğrafı için özel URL fonksiyonu
 */
export const getMemberImageUrl = (imageUrl?: string | null): string => {
  return getImageUrl(imageUrl);
};

/**
 * Hero slide görseli için özel URL fonksiyonu
 */
export const getSlideImageUrl = (imageUrl?: string | null): string => {
  return getImageUrl(imageUrl, 'https://via.placeholder.com/800x600/e5e7eb/9ca3af?text=Slide');
};
