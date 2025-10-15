import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Carousel, 
  List,
  Avatar,
  Space,
  Modal,
  Tag
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarOutlined, 
  UserOutlined, 
  RightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { News, HeroSlide, Statistic } from '../../types';
import { newsApi, heroSlidesApi, statisticsApi } from '../../services/api';
import SEO from '../../components/SEO';
import StructuredData from '../../components/StructuredData';
import { getNewsImageUrl, getSlideImageUrl } from '../../utils/imageUrl';
import DynamicCard from '../../components/DynamicCard';
import LazyImage from '../../components/LazyImage';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import '../../styles/animations.css';

const { Title, Paragraph, Text } = Typography;

const Anasayfa: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const carouselRef = useRef<any>(null);
  
  // Türkçe locale ayarla
  dayjs.locale('tr');
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [announcements, setAnnouncements] = useState<News[]>([]);
  const [events, setEvents] = useState<News[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Tüm verileri tek seferde yükle
    fetchAllData();
  }, []);

  // Tüm verileri tek seferde yükleyen optimize edilmiş fonksiyon
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Tüm verileri paralel yükle (hero slides zaten layout'ta yüklendi)
      const [newsResponse, heroSlidesResponse, statisticsResponse] = await Promise.all([
        newsApi.getAll(),
        heroSlidesApi.getAll(),
        statisticsApi.getAll()
      ]);

      // Hero slides
      if (heroSlidesResponse.data.success) {
        const activeSlides = heroSlidesResponse.data.data
          .filter(slide => slide.isActive)
          .sort((a, b) => a.order - b.order);
        setHeroSlides(activeSlides);
      } else {
        setHeroSlides([]);
      }

      // Haber verilerini işle
      if (newsResponse.data.success) {
        const allNews = newsResponse.data.data;
        
        // Son haberler (ilk 3)
        setLatestNews(allNews.slice(0, 3));
        
        // Duyurular
        const announcementNews = allNews.filter((news: News) => 
          news.category?.toLowerCase().includes('duyuru')
        );
        setAnnouncements(announcementNews.slice(0, 4));
        
        // Etkinlikler
        const eventNews = allNews.filter((news: News) => 
          news.category?.toLowerCase().includes('etkinlik')
        );
        setEvents(eventNews.slice(0, 4));
      }

      // İstatistikler
      if (statisticsResponse.data.success) {
        setStatistics(statisticsResponse.data.data);
      }

    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eski fonksiyonlar - geriye uyumluluk için korundu
  const fetchLatestNews = async () => {
    try {
      const response = await newsApi.getAll();
      if (response.data.success) {
        setLatestNews(response.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await newsApi.getAll();
      if (response.data.success) {
        const announcementNews = response.data.data.filter((news: News) => 
          news.category?.toLowerCase().includes('duyuru')
        );
        setAnnouncements(announcementNews.slice(0, 4));
      }
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await newsApi.getAll();
      if (response.data.success) {
        const eventNews = response.data.data.filter((news: News) => 
          news.category?.toLowerCase().includes('etkinlik')
        );
        setEvents(eventNews.slice(0, 4));
      }
    } catch (error) {
      console.error('Etkinlikler yüklenirken hata:', error);
    }
  };


  // Eski fonksiyonlar - geriye uyumluluk için korundu
  const fetchHeroSlides = async () => {
    try {
      const response = await heroSlidesApi.getAll();
      if (response.data.success) {
        const activeSlides = response.data.data
          .filter(slide => slide.isActive)
          .sort((a, b) => a.order - b.order);
        setHeroSlides(activeSlides);
      } else {
        setHeroSlides([]);
      }
    } catch (error) {
      console.error('Hero slides yüklenirken hata:', error);
      setHeroSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await statisticsApi.getAll();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Genel': 'blue',
      'Etkinlik': 'green',
      'Duyuru': 'orange',
      'Haber': 'red',
      'Proje': 'purple'
    };
    return colors[category] || 'default';
  };

  const handleNewsClick = (news: News) => {
    setSelectedNews(news);
    setModalVisible(true);
  };


  return (
    <div>
      <SEO 
        title="Ana Sayfa"
        description="Kurumsal Web Sitesi ana sayfası - Kurumsal web sitesi şablonu ve yönetim paneli."
        keywords="Kurumsal Web Sitesi ana sayfa, kurumsal web sitesi, şablon, yönetim paneli"
        url="/"
      />
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <style>{`
        .news-card-cover {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 200px;
          border-radius: 8px 8px 0 0;
        }
        
        .news-card-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .news-card-cover:hover img {
          transform: scale(1.05);
        }
        
        .news-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(30, 58, 138, 0.8), rgba(59, 130, 246, 0.8));
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .news-card:hover .news-overlay {
          opacity: 1;
        }
      `}</style>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: 48 }}
      >
        {heroSlides.length > 0 ? (
          <Carousel ref={carouselRef} autoplay effect="fade" style={{ height: window.innerWidth <= 768 ? 'auto' : 600, borderRadius: '12px', overflow: 'hidden' }}>
            {heroSlides.map((slide, index) => (
            <div key={slide.id}>
              <div 
                style={{
                  height: window.innerWidth <= 768 ? 'auto' : 600,
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
                }}
              >
                {/* Sol taraf - Fotoğraf */}
                <div 
                  style={{
                    width: window.innerWidth <= 768 ? '100%' : '70%',
                    height: window.innerWidth <= 768 ? '300px' : '100%',
                    position: 'relative'
                  }}
                >
                  <LazyImage
                    src={getSlideImageUrl(slide.imageUrl)}
                    alt={slide.title}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))'
                    }}
                  />
                </div>
                
                {/* Sağ taraf - Siyah alan ve içerik */}
                <div 
                  style={{
                    width: window.innerWidth <= 768 ? '100%' : '30%',
                    height: window.innerWidth <= 768 ? 'auto' : '100%',
                    background: '#1a1a1a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: window.innerWidth <= 768 ? '20px' : '40px',
                    color: 'white',
                    position: 'relative',
                    minHeight: window.innerWidth <= 768 ? '200px' : 'auto'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ textAlign: 'left', width: '100%' }}
                  >
                    <Text style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                      HABERLER
                    </Text>
                    {(slide.title || slide.description) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {slide.title && (
                          <Title level={2} style={{ 
                            color: 'white', 
                            marginBottom: slide.description ? 12 : 16,
                            fontSize: '2rem',
                            fontWeight: 'bold'
                          }}>
                            {slide.title}
                          </Title>
                        )}
                        {slide.description && (
                          <div 
                            style={{ 
                              color: '#d1d5db', 
                              fontSize: '16px',
                              lineHeight: '1.6',
                              display: 'block',
                              whiteSpace: 'pre-line'
                            }}
                            dangerouslySetInnerHTML={{ __html: slide.description }}
                          />
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Navigation controls at the bottom */}
                  <div
                    style={{
                      position: window.innerWidth <= 768 ? 'relative' : 'absolute',
                      bottom: window.innerWidth <= 768 ? 'auto' : 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: '#1a1a1a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: window.innerWidth <= 768 ? '0 20px' : '0 40px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      marginTop: window.innerWidth <= 768 ? '20px' : '0'
                    }}
                  >
                    <Button
                      type="link"
                      style={{ color: 'white', fontSize: '16px', padding: 0 }}
                      onClick={() => carouselRef.current?.prev()}
                    >
                      &lt; ÖNCEKİ
                    </Button>
                    <Button
                      type="link"
                      style={{ color: 'white', fontSize: '16px', padding: 0 }}
                      onClick={() => carouselRef.current?.next()}
                    >
                      SONRAKİ &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </Carousel>
        ) : (
          <div style={{ 
            height: 600, 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center'
          }}>
            <div>
              <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
                Hoş Geldiniz
              </Title>
              <Paragraph style={{ color: 'white', fontSize: '18px' }}>
                Hero slides henüz eklenmemiş. Admin panelinden slide ekleyebilirsiniz.
              </Paragraph>
            </div>
          </div>
        )}
      </motion.div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* İstatistikler */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            {statistics.map((stat, index) => {
              const getIcon = (iconName?: string) => {
                switch (iconName) {
                  case 'UserOutlined': return <UserOutlined style={{ color: 'white' }} />;
                  case 'CalendarOutlined': return <CalendarOutlined style={{ color: 'white' }} />;
                  case 'RightOutlined': return <RightOutlined style={{ color: 'white' }} />;
                  default: return null;
                }
              };

              const getGradient = (index: number) => {
                const gradients = [
                  'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                  'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                  'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                ];
                return gradients[index % gradients.length];
              };

              return (
                <Col xs={24} sm={12} md={6} key={stat.id}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      console.log('Kart tıklandı:', stat.title);
                      const normalizedTitle = stat.title?.toLowerCase()
                        .replace('ı', 'i')
                        .replace('ğ', 'g')
                        .replace('ü', 'u')
                        .replace('ş', 's')
                        .replace('ö', 'o')
                        .replace('ç', 'c');
                      console.log('Normalize edilmiş başlık:', normalizedTitle);
                      
                      if (normalizedTitle?.includes('etkinlik') || normalizedTitle?.includes('yillik')) {
                        console.log('Etkinlik filtresi uygulanıyor');
                        navigate('/haberler', { state: { filterCategory: 'Etkinlik' } });
                      } else if (normalizedTitle?.includes('proje')) {
                        console.log('Proje filtresi uygulanıyor');
                        navigate('/haberler', { state: { filterCategory: 'Proje' } });
                      } else {
                        console.log('Hiçbir filtre uygulanmadı');
                      }
                    }}
                    style={{ cursor: (() => {
                      const normalizedTitle = stat.title?.toLowerCase()
                        ?.replace('ı', 'i')
                        ?.replace('ğ', 'g')
                        ?.replace('ü', 'u')
                        ?.replace('ş', 's')
                        ?.replace('ö', 'o')
                        ?.replace('ç', 'c');
                      return (normalizedTitle?.includes('etkinlik') || normalizedTitle?.includes('yillik') || normalizedTitle?.includes('proje')) ? 'pointer' : 'default';
                    })() }}
                  >
                    <Card 
                      className="hover-lift"
                      style={{ 
                        borderRadius: '12px',
                        background: stat.color ? `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)` : getGradient(index),
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                          {stat.title}
                        </div>
                        <div style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>
                          {getIcon(stat.icon)} 
                          <span style={{ marginLeft: '8px' }}>
                            {typeof stat.value === 'number' && stat.value < 2000 
                              ? stat.value.toString() 
                              : stat.value
                            }
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </motion.div>

        {/* Dinamik Organizasyon Kartı */}
        <DynamicCard variant="homepage" />

        {/* Son Haberler */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Title 
                  level={2} 
                  style={{ 
                    textAlign: 'center', 
                    marginBottom: 32,
                    background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 700
                  }}
                >
                  Son Haberler
                </Title>
              </motion.div>
            </Col>
            {latestNews.map((news, index) => (
              <Col xs={24} md={8} key={news.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    className="news-card hover-lift"
                    style={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    cover={
                      <div className="news-card-cover">
                        <LazyImage
                          alt={news.title}
                          src={getNewsImageUrl(news.imageUrl)}
                          style={{ width: '100%', height: '100%' }}
                        />
                        <div className="news-overlay">
                          <Button 
                            type="primary" 
                            shape="round"
                            style={{ 
                              background: 'white',
                              color: '#1e3a8a',
                              border: 'none',
                              fontWeight: 600
                            }}
                            onClick={() => navigate('/haberler', { state: { selectedNewsId: news.id } })}
                          >
                            Devamını Oku
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <motion.div
                          whileHover={{ color: '#1e3a8a' }}
                          transition={{ duration: 0.3 }}
                        >
                          {news.title}
                        </motion.div>
                      }
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {news.summary}
                          </Paragraph>
                          <div style={{ color: '#999', fontSize: '12px' }}>
                            <CalendarOutlined /> {dayjs(news.publishDate).format('DD.MM.YYYY')}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Duyurular ve Etkinlikler */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            {/* Duyurular */}
            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card
                  style={{ 
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: '#f8f9fa',
                    height: '100%'
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: 12 
                    }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        background: '#dc2626',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8
                      }}>
                        <div style={{
                          width: 8,
                          height: 8,
                          background: 'white',
                          borderRadius: '50%'
                        }} />
                      </div>
                      <Title 
                        level={3} 
                        style={{ 
                          color: '#dc2626',
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        DUYURULAR
                      </Title>
                    </div>
                    <div style={{
                      height: 2,
                      background: 'linear-gradient(to right, #dc2626 30px, #374151 100%)',
                      marginBottom: 16
                    }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {announcements.map((announcement, index) => (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          transition: 'background-color 0.3s ease'
                        }}
                        whileHover={{ backgroundColor: '#e5e7eb' }}
                        onClick={() => handleNewsClick(announcement)}
                      >
                        <div style={{
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid #dc2626',
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          marginRight: 12,
                          marginTop: 6
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: 4,
                            lineHeight: '1.4'
                          }}>
                            {announcement.title}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            <div style={{
                              width: 12,
                              height: 12,
                              background: '#dc2626',
                              borderRadius: '50%',
                              marginRight: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <div style={{
                                width: 4,
                                height: 4,
                                background: 'white',
                                borderRadius: '50%'
                              }} />
                            </div>
                            {dayjs(announcement.publishDate).format('DD MMMM YYYY').toUpperCase()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </Col>

            {/* Etkinlikler */}
            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card
                  style={{ 
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: '#f8f9fa',
                    height: '100%'
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: 12 
                    }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        background: '#dc2626',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8
                      }}>
                        <div style={{
                          width: 12,
                          height: 12,
                          background: 'white',
                          borderRadius: '2px',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 2,
                            left: 2,
                            width: 8,
                            height: 6,
                            border: '1px solid #dc2626',
                            borderRadius: '1px'
                          }} />
                        </div>
                      </div>
                      <Title 
                        level={3} 
                        style={{ 
                          color: '#dc2626',
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        ETKİNLİKLER
                      </Title>
                    </div>
                    <div style={{
                      height: 2,
                      background: 'linear-gradient(to right, #dc2626 30px, #374151 100%)',
                      marginBottom: 16
                    }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          transition: 'background-color 0.3s ease'
                        }}
                        whileHover={{ backgroundColor: '#e5e7eb' }}
                        onClick={() => handleNewsClick(event)}
                      >
                        <div style={{
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid #dc2626',
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          marginRight: 12,
                          marginTop: 6
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: 4,
                            lineHeight: '1.4'
                          }}>
                            {event.title}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            <div style={{
                              width: 12,
                              height: 12,
                              background: '#dc2626',
                              borderRadius: '50%',
                              marginRight: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <div style={{
                                width: 4,
                                height: 4,
                                background: 'white',
                                borderRadius: '50%'
                              }} />
                            </div>
                            {dayjs(event.publishDate).format('DD MMMM YYYY').toUpperCase()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

      </div>

      {/* Haber Detay Modal */}
      <Modal
        title={selectedNews?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Kapat
          </Button>
        ]}
        width={800}
      >
        {selectedNews && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <LazyImage
                src={getNewsImageUrl(selectedNews.imageUrl)}
                alt={selectedNews.title}
                style={{ width: '100%', height: 300, borderRadius: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Tag color={getCategoryColor(selectedNews.category)}>
                {selectedNews.category}
              </Tag>
              <span style={{ marginLeft: 16, color: '#999' }}>
                <CalendarOutlined /> {dayjs(selectedNews.publishDate).format('DD.MM.YYYY')}
              </span>
            </div>
            {selectedNews.summary && (
              <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ marginBottom: 8, color: '#1890ff' }}>
                  Özet
                </Title>
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedNews.summary }}
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                    fontStyle: 'italic',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1890ff'
                  }}
                />
              </div>
            )}
            {selectedNews.content && (
              <div 
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: '#333'
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
});

Anasayfa.displayName = 'Anasayfa';

export default Anasayfa;
