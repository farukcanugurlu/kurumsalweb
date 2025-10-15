import axios from 'axios';
import { News, Page, MenuItem, OrganizationMember, ContactInfo, HeroSlide, Statistic, Logo, Commission, OrganizationSettings, OrganizationChart, OrganizationChartApi, ApiResponse } from '../types';

// Backend API base URL'i - her ortamda dinamik
const getApiBaseUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Eğer port varsa onu da ekle
  const port = window.location.port;
  const portSuffix = port ? `:${port}` : '';
  
  return `${protocol}//${hostname}${portSuffix}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor - caching için
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

api.interceptors.request.use(
  (config) => {
    // GET istekleri için cache kontrolü
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params)}`;
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Cache'den döndür
        return Promise.reject({
          isCached: true,
          data: cached.data
        });
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - cache'e kaydet
api.interceptors.response.use(
  (response) => {
    // GET isteklerini cache'e kaydet
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params)}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Cache'den gelen veri ise başarılı olarak döndür
    if (error.isCached) {
      return Promise.resolve({ data: error.data });
    }
    return Promise.reject(error);
  }
);

// News API
export const newsApi = {
  getAll: () => api.get<ApiResponse<News[]>>('/news'),
  getById: (id: number) => api.get<ApiResponse<News>>(`/news/${id}`),
  create: (news: Omit<News, 'id'>) => api.post<ApiResponse<News>>('/news', news),
  update: (id: number, news: Partial<News>) => api.put<ApiResponse<News>>(`/news/${id}`, news),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/news/${id}`),
};

// Pages API
export const pagesApi = {
  getAll: () => api.get<ApiResponse<Page[]>>('/pages'),
  getBySlug: (slug: string) => api.get<ApiResponse<Page>>(`/pages/slug/${slug}`),
  create: (page: Omit<Page, 'id'>) => api.post<ApiResponse<Page>>('/pages', page),
  update: (id: number, page: Partial<Page>) => api.put<ApiResponse<Page>>(`/pages/${id}`, page),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/pages/${id}`),
};

// Menu API
export const menuApi = {
  getAll: () => api.get<ApiResponse<MenuItem[]>>('/menu'),
  getAllForAdmin: () => api.get<ApiResponse<MenuItem[]>>('/menu/admin'),
  getWithChildren: () => api.get<ApiResponse<MenuItem[]>>('/menu/with-children'),
  create: (item: Omit<MenuItem, 'id'>) => api.post<ApiResponse<MenuItem>>('/menu', item),
  update: (id: number, item: Partial<MenuItem>) => api.put<ApiResponse<MenuItem>>(`/menu/${id}`, item),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/menu/${id}`),
  syncPage: (pageId: number) => api.post<ApiResponse<MenuItem>>(`/menu/sync-page/${pageId}`),
};

// Organization API
export const organizationApi = {
  getMembers: () => api.get<ApiResponse<OrganizationMember[]>>('/organization/members'),
  createMember: (member: Omit<OrganizationMember, 'id'>) => api.post<ApiResponse<OrganizationMember>>('/organization/members', member),
  updateMember: (id: number, member: Partial<OrganizationMember>) => api.put<ApiResponse<OrganizationMember>>(`/organization/members/${id}`, member),
  deleteMember: (id: number) => api.delete<ApiResponse<void>>(`/organization/members/${id}`),
  getScheme: () => api.get<ApiResponse<{ hasOrganogram: boolean; schemeUrl: string; description: string }>>('/organization/scheme'),
  setScheme: (schemeData: { schemeUrl?: string; description?: string }) => api.post<ApiResponse<void>>('/organization/scheme', schemeData),
};

// Contact API
export const contactApi = {
  getInfo: () => api.get<ApiResponse<ContactInfo[]>>('/contact'),
  updateInfo: (info: ContactInfo[]) => api.put<ApiResponse<ContactInfo[]>>('/contact', info),
};

// Hero Slides API
export const heroSlidesApi = {
  getAll: () => api.get<ApiResponse<HeroSlide[]>>('/HeroSlides'),
  getById: (id: number) => api.get<ApiResponse<HeroSlide>>(`/HeroSlides/${id}`),
  create: (slide: Omit<HeroSlide, 'id'>) => api.post<ApiResponse<HeroSlide>>('/HeroSlides', slide),
  update: (id: number, slide: Partial<HeroSlide>) => api.put<ApiResponse<HeroSlide>>(`/HeroSlides/${id}`, slide),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/HeroSlides/${id}`),
  reorder: (slides: { id: number; order: number }[]) => api.put<ApiResponse<void>>('/HeroSlides/reorder', { slides }),
};

// File Upload API
export const fileUploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<{ url: string; fileName: string; originalName: string; size: number }>>('/FileUpload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (fileName: string) => api.delete<ApiResponse<void>>('/FileUpload/delete', { data: { fileName } }),
};

export const statisticsApi = {
  getAll: () => api.get<ApiResponse<Statistic[]>>('/Statistics'),
  getById: (id: number) => api.get<ApiResponse<Statistic>>(`/Statistics/${id}`),
  create: (statistic: Omit<Statistic, 'id'>) => api.post<ApiResponse<Statistic>>('/Statistics', statistic),
  update: (id: number, statistic: Statistic) => api.put<ApiResponse<Statistic>>(`/Statistics/${id}`, statistic),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/Statistics/${id}`),
  reorder: (statistics: Statistic[]) => api.put<ApiResponse<Statistic[]>>('/Statistics/reorder', statistics),
};

// Logo API
export const logoApi = {
  getAll: () => api.get<ApiResponse<Logo[]>>('/Logo'),
  getById: (id: number) => api.get<ApiResponse<Logo>>(`/Logo/${id}`),
  getByType: (type: string) => api.get<ApiResponse<Logo>>(`/Logo/by-type/${type}`),
  create: (logo: Omit<Logo, 'id'>) => api.post<ApiResponse<Logo>>('/Logo', logo),
  update: (id: number, logo: Partial<Logo>) => api.put<ApiResponse<Logo>>(`/Logo/${id}`, logo),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/Logo/${id}`),
};

// Site Settings API
export const siteSettingsApi = {
  getAll: () => api.get<ApiResponse<OrganizationSettings[]>>('/SiteSettings'),
  getByKey: (key: string) => api.get<ApiResponse<OrganizationSettings>>(`/SiteSettings/${key}`),
  createOrUpdate: (setting: { key: string; value?: string; description?: string }) => 
    api.post<ApiResponse<OrganizationSettings>>('/SiteSettings', setting),
  delete: (key: string) => api.delete<ApiResponse<void>>(`/SiteSettings/${key}`),
};

// Commission API
export const commissionApi = {
  getAll: () => api.get<ApiResponse<Commission[]>>('/commission'),
  getAllForAdmin: () => api.get<ApiResponse<Commission[]>>('/commission/admin'),
  getById: (id: number) => api.get<ApiResponse<Commission>>(`/commission/${id}`),
  create: (commission: Omit<Commission, 'id'>) => api.post<ApiResponse<Commission>>('/commission', commission),
  update: (id: number, commission: Partial<Commission>) => api.put<ApiResponse<Commission>>(`/commission/${id}`, commission),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/commission/${id}`),
};

// Organization Chart API
export const organizationChartApi = {
  getAll: () => api.get<ApiResponse<OrganizationChart[]>>('/organizationchart'),
  getAllForAdmin: () => api.get<ApiResponse<OrganizationChart[]>>('/organizationchart/admin'),
  getById: (id: number) => api.get<ApiResponse<OrganizationChart>>(`/organizationchart/${id}`),
  create: (chart: Omit<OrganizationChart, 'id'>) => api.post<ApiResponse<OrganizationChart>>('/organizationchart', chart),
  update: (id: number, chart: Partial<OrganizationChart>) => api.put<ApiResponse<OrganizationChart>>(`/organizationchart/${id}`, chart),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/organizationchart/${id}`),
  reorder: (charts: OrganizationChart[]) => api.post<ApiResponse<void>>('/organizationchart/reorder', charts),
};

export default api;
