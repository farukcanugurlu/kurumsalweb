import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/analyticsApi';

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Admin panel sayfalarını analytics'ten hariç tut
    const isAdminRoute = location.pathname.startsWith('/yonetim') || 
                        location.pathname.startsWith('/admin');
    
    if (!isAdminRoute) {
      // Sadece public sayfalar için ziyareti takip et
      trackPageView(location.pathname);
    }
  }, [location.pathname]);

  return null; // Bu component hiçbir şey render etmez
};

export default AnalyticsTracker;
