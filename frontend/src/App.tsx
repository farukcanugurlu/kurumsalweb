import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import trTR from 'antd/locale/tr_TR';
import { HelmetProvider } from 'react-helmet-async';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AdminGuard from './components/AdminGuard';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Haberler from './pages/admin/Haberler';
import Sayfalar from './pages/admin/Sayfalar';
import Menu from './pages/admin/Menu';
import Organizasyon from './pages/admin/Organizasyon';
import Komisyonlar from './pages/admin/komisyonlar';
import Iletisim from './pages/admin/Iletisim';
import HeroSlides from './pages/admin/HeroSlides';
import Statistics from './pages/admin/Statistics';
import Logolar from './pages/admin/Logolar';
import KartYonetimi from './pages/admin/KartYonetimi';
import SiteSettings from './pages/admin/SiteSettings';
import OrganizasyonSema from './pages/admin/OrganizasyonSema';
import Analytics from './pages/admin/Analytics';
import Anasayfa from './pages/public/Anasayfa';
import Hakkimizda from './pages/public/Hakkimizda';
import OrganizasyonPublic from './pages/public/Organizasyon';
import HaberlerPublic from './pages/public/Haberler';
import IletisimPublic from './pages/public/Iletisim';
import YonetimKurulu from './pages/public/YonetimKurulu';
import KunyePage from './components/KunyePage';
import DynamicPage from './pages/public/DynamicPage';
import AnalyticsTracker from './components/AnalyticsTracker';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <HelmetProvider>
      <ConfigProvider locale={trTR}>
        <Router>
          <ScrollToTop />
          <AnalyticsTracker />
          <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes - Guard ile korumalı */}
          <Route path="/yonetim" element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }>
            <Route index element={<Dashboard />} />
            <Route path="hero-slides" element={<HeroSlides />} />
            <Route path="istatistikler" element={<Statistics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="logolar" element={<Logolar />} />
            <Route path="kart-yonetimi" element={<KartYonetimi />} />
            <Route path="haberler" element={<Haberler />} />
            <Route path="sayfalar" element={<Sayfalar />} />
            <Route path="menu" element={<Menu />} />
            <Route path="organizasyon" element={<Organizasyon />} />
            <Route path="komisyonlar" element={<Komisyonlar />} />
            <Route path="iletisim" element={<Iletisim />} />
            <Route path="site-ayarlari" element={<SiteSettings />} />
            <Route path="organizasyon-sema" element={<OrganizasyonSema />} />
          </Route>
          
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Anasayfa />} />
            <Route path="hakkimizda" element={<Hakkimizda />} />
            <Route path="komisyonlarvesektorkurullari" element={<OrganizasyonPublic />} />
            <Route path="haberler" element={<HaberlerPublic />} />
            <Route path="iletisim" element={<IletisimPublic />} />
            <Route path="yonetimkurulu" element={<YonetimKurulu />} />
            <Route path="kunye" element={<KunyePage />} />
            <Route path=":slug" element={<DynamicPage />} />
          </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </HelmetProvider>
  );
}

export default App;