import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'https://localhost:7001/api' : '/api');

export interface AnalyticsData {
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
}

export interface AnalyticsSummary {
  period: string;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalSessions: number;
  averageBounceRate: number;
  averageSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topCountries: Array<{ country: string; visitors: number }>;
  deviceTypes: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
}

export interface ChartDataPoint {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
}

export interface RealtimeData {
  hourlyData: Array<{ hour: number; visitors: number; pageViews: number }>;
  currentVisitors: number;
  lastUpdated: string;
}

export const analyticsApi = {
  // Ziyaret takibi
  trackVisit: async (data: AnalyticsData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/analytics/track`, data);
      return response.data;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return { success: false, message: 'Tracking failed' };
    }
  },

  // Özet veriler
  getSummary: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily'): Promise<AnalyticsSummary | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/summary?period=${period}`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Analytics summary error:', error);
      return null;
    }
  },

  // Grafik verileri
  getChartData: async (period: 'daily' | 'weekly' | 'monthly' = 'daily', days: number = 30): Promise<ChartDataPoint[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/chart-data?period=${period}&days=${days}`);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Analytics chart data error:', error);
      return [];
    }
  },

  // Gerçek zamanlı veriler
  getRealtimeData: async (): Promise<RealtimeData | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/realtime`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Analytics realtime data error:', error);
      return null;
    }
  }
};

// Otomatik ziyaret takibi
export const trackPageView = async (pageUrl: string = window.location.pathname) => {
  try {
    // Cihaz bilgilerini topla
    const userAgent = navigator.userAgent;
    const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
    
    // Tarayıcı bilgisi
    const browser = getBrowserName(userAgent);
    
    // İşletim sistemi
    const operatingSystem = getOperatingSystem(userAgent);
    
    // Referrer
    const referrer = document.referrer || 'direct';

    const analyticsData: AnalyticsData = {
      pageUrl,
      referrer,
      userAgent,
      deviceType,
      browser,
      operatingSystem,
      country: 'Turkey', // Varsayılan, gerçek uygulamada IP'den alınabilir
      city: 'Istanbul'
    };

    await analyticsApi.trackVisit(analyticsData);
  } catch (error) {
    console.error('Page view tracking error:', error);
  }
};

// Tarayıcı adını belirle
const getBrowserName = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

// İşletim sistemini belirle
const getOperatingSystem = (userAgent: string): string => {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};
