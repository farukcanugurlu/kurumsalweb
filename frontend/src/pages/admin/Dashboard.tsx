import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, List, Avatar, Button, Spin } from 'antd';
import { FileTextOutlined, TeamOutlined, PhoneOutlined, MenuOutlined, EyeOutlined, BarChartOutlined } from '@ant-design/icons';
import { newsApi, pagesApi, organizationApi, menuApi, heroSlidesApi } from '../../services/api';
import { analyticsApi } from '../../services/analyticsApi';
import { News } from '../../types';
import { getNewsImageUrl } from '../../utils/imageUrl';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNews: 0,
    activePages: 0,
    organizationMembers: 0,
    menuItems: 0,
    heroSlides: 0,
    totalPageViews: 0,
    uniqueVisitors: 0,
    currentVisitors: 0
  });
  const [recentNews, setRecentNews] = useState<News[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Paralel olarak tüm verileri çek
      const [newsResponse, pagesResponse, membersResponse, menuResponse, slidesResponse, analyticsSummary, realtimeData] = await Promise.all([
        newsApi.getAll(),
        pagesApi.getAll(),
        organizationApi.getMembers(),
        menuApi.getAll(),
        heroSlidesApi.getAll(),
        analyticsApi.getSummary('daily'),
        analyticsApi.getRealtimeData()
      ]);

      // İstatistikleri hesapla
      const totalNews = newsResponse.data.success ? newsResponse.data.data.length : 0;
      const activePages = pagesResponse.data.success ? pagesResponse.data.data.filter((page: any) => page.isActive).length : 0;
      const organizationMembers = membersResponse.data.success ? membersResponse.data.data.length : 0;
      const menuItems = menuResponse.data.success ? menuResponse.data.data.length : 0;
      const heroSlides = slidesResponse.data.success ? slidesResponse.data.data.length : 0;
      const totalPageViews = analyticsSummary?.totalPageViews || 0;
      const uniqueVisitors = analyticsSummary?.totalUniqueVisitors || 0;
      const currentVisitors = realtimeData?.currentVisitors || 0;

      setStats({
        totalNews,
        activePages,
        organizationMembers,
        menuItems,
        heroSlides,
        totalPageViews,
        uniqueVisitors,
        currentVisitors
      });

      // Son 5 haberi al
      if (newsResponse.data.success) {
        const sortedNews = newsResponse.data.data
          .sort((a: News, b: News) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
          .slice(0, 5);
        setRecentNews(sortedNews);
      }
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Dashboard verileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Haber"
              value={stats.totalNews}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aktif Sayfalar"
              value={stats.activePages}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Organizasyon Üyeleri"
              value={stats.organizationMembers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Menü Öğeleri"
              value={stats.menuItems}
              prefix={<MenuOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Analytics İstatistikleri */}
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Günlük Sayfa Görüntüleme"
              value={stats.totalPageViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Benzersiz Ziyaretçi"
              value={stats.uniqueVisitors}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Şu Anda Aktif"
              value={stats.currentVisitors}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card 
            title="Son Haberler" 
            extra={<Button type="link" href="/yonetim/haberler">Tümünü Gör</Button>}
          >
            {recentNews.length > 0 ? (
              <List
                dataSource={recentNews}
                renderItem={(news) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={getNewsImageUrl(news.imageUrl)} 
                          size="small"
                        />
                      }
                      title={
                        <span style={{ fontSize: '14px' }}>
                          {news.title.length > 50 ? `${news.title.substring(0, 50)}...` : news.title}
                        </span>
                      }
                      description={
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(news.publishDate).toLocaleDateString('tr-TR')}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <p>Henüz haber eklenmemiş.</p>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Sistem Durumu" extra={<Button type="link" href="/yonetim/ayarlar">Ayarlar</Button>}>
            <div style={{ marginBottom: 16 }}>
              <p><strong>Hero Slides:</strong> {stats.heroSlides} adet</p>
              <p><strong>Toplam İçerik:</strong> {stats.totalNews + stats.activePages} adet</p>
              <p><strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '6px',
              color: '#52c41a'
            }}>
              ✓ Sistem normal çalışıyor
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
