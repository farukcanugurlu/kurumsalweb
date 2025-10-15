export interface News {
  id: number;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  publishDate: string;
  isActive: boolean;
  category: string;
}

export enum PageTemplate {
  Default = 0,
  Contact = 1,
  Information = 2,
  Blog = 3,
  Gallery = 4,
  Services = 5,
  About = 6,
  PresidentsMessage = 7,
  Credits = 8,
  VisionMissionValues = 9,
  Render = 10
}

export interface Page {
  id: number;
  title: string;
  content: string;
  slug: string;
  isActive: boolean;
  order: number;
  parentId?: number;
  template: PageTemplate;
  imageUrl?: string;
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
  parentId?: number;
  children?: MenuItem[];
}

export interface OrganizationMember {
  id: number;
  name: string;
  position: string;
  department: string;
  imageUrl?: string;
  bio?: string;
  order: number;
  category?: string; // board, commission, other
}

export interface ContactInfo {
  id: number;
  type: 'phone' | 'email' | 'address' | 'social';
  value: string;
  label: string;
  url?: string; // Sosyal medya için URL alanı
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

export interface HeroSlide {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface Statistic {
  id: number;
  title: string;
  value: number;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export interface Logo {
  id: number;
  name: string;
  imageUrl: string;
  altText?: string;
  type: string;
  width: number;
  height: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Commission {
  id: number;
  name: string;
  description: string;
  chairman: string;
  viceChairman: string;
  members?: string; // JSON string olarak üye listesi
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OrganizationSettings {
  id: number;
  key: string;
  value?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OrganizationChart {
  id: number;
  title: string;
  parentId?: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  parent?: OrganizationChart;
  children?: OrganizationChart[];
}

// Backend API için ayrı interface
export interface OrganizationChartApi {
  Id: number;
  Title: string;
  ParentId?: number;
  Order: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt?: string;
  Parent?: OrganizationChartApi;
  Children?: OrganizationChartApi[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
