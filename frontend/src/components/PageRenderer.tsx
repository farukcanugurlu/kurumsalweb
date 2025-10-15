import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Divider, Button, Space, Image, Tabs, Spin } from 'antd';
import DynamicCard from './DynamicCard';
import { Page, PageTemplate, Commission } from '../types';
import { pagesApi, commissionApi } from '../services/api';
import { 
  InfoCircleOutlined, 
  BookOutlined, 
  PictureOutlined, 
  SettingOutlined, 
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  BulbOutlined,
  CameraOutlined,
  ToolOutlined,
  UserOutlined,
  EyeOutlined,
  RocketOutlined,
  SoundOutlined,
  ExperimentOutlined,
  HeartOutlined,
  DollarOutlined,
  BuildOutlined,
  GlobalOutlined,
  BranchesOutlined,
  EnvironmentOutlined,
  StarOutlined,
  WomanOutlined,
  RobotOutlined,
  CarOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  LaptopOutlined,
  TruckOutlined,
  MoneyCollectOutlined,
  ToolOutlined as ToolIcon,
  HomeOutlined,
  CloudOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface PageRendererProps {
  page: Page;
}

// Dinamik Organizasyon Kartı Component'i - Kaldırıldı
// const KurumsalCard: React.FC = () => <DynamicCard variant="page" />;

const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  const renderTemplate = () => {
    switch (page.template) {
      case PageTemplate.Information:
        return <InformationTemplate page={page} />;
      case PageTemplate.Blog:
        return <BlogTemplate page={page} />;
      case PageTemplate.Gallery:
        return <GalleryTemplate page={page} />;
      case PageTemplate.Services:
        return <ServicesTemplate page={page} />;
      case PageTemplate.About:
        return <AboutTemplate page={page} />;
      case PageTemplate.PresidentsMessage:
        return <PresidentsMessageTemplate page={page} />;
      case PageTemplate.Credits:
        return <CreditsTemplate page={page} />;
      case PageTemplate.VisionMissionValues:
        return <VisionMissionValuesTemplate page={page} />;
      case PageTemplate.Render:
        return <RenderTemplate page={page} />;
      default:
        return <DefaultTemplate page={page} />;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {renderTemplate()}
    </div>
  );
};

// Varsayılan Şablon
const DefaultTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <>
    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Space direction="vertical" size="small">
          <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <Title level={1} style={{ margin: 0 }}>
            {page.title}
          </Title>
        </Space>
      </div>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          textAlign: 'justify'
        }}
      />
    </Card>
  </>
);


// Bilgi Şablonu
const InformationTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <div>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: 32,
      padding: '32px 0',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: page.imageUrl 
          ? `url("${page.imageUrl}") center/cover`
          : 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
        opacity: 0.1,
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <InfoCircleOutlined style={{ fontSize: '48px', color: 'white' }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            {page.title}
          </Title>
        </Space>
      </div>
    </div>

    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          textAlign: 'justify'
        }}
      />
    </Card>
  </div>
);

// Blog Şablonu
const BlogTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <div>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: 32,
      padding: '32px 0',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: page.imageUrl 
          ? `url("${page.imageUrl}") center/cover`
          : 'url("https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
        opacity: 0.1,
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <BookOutlined style={{ fontSize: '48px', color: 'white' }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            {page.title}
          </Title>
        </Space>
      </div>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div 
            dangerouslySetInnerHTML={{ __html: page.content }}
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151',
              textAlign: 'justify'
            }}
          />
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 16 }}>
            İlgili İçerikler
          </Title>
          <div style={{ 
            padding: '16px', 
            background: '#f8fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <Text style={{ color: '#666', fontSize: '14px' }}>
              Bu sayfa ile ilgili diğer içerikler burada görüntülenecek.
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
);

// Galeri Şablonu
const GalleryTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <div>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: 32,
      padding: '32px 0',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: page.imageUrl 
          ? `url("${page.imageUrl}") center/cover`
          : 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
        opacity: 0.1,
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <CameraOutlined style={{ fontSize: '48px', color: 'white' }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            {page.title}
          </Title>
        </Space>
      </div>
    </div>
    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          textAlign: 'justify'
        }}
      />
    </Card>
  </div>
);

// Hizmetler Şablonu
const ServicesTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <div>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: 32,
      padding: '32px 0',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: page.imageUrl 
          ? `url("${page.imageUrl}") center/cover`
          : 'url("https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
        opacity: 0.1,
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <ToolOutlined style={{ fontSize: '48px', color: 'white' }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            {page.title}
          </Title>
        </Space>
      </div>
    </div>

    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Title level={3} style={{ color: '#1890ff', marginBottom: 24, textAlign: 'center' }}>
        Hizmetlerimiz
      </Title>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          textAlign: 'justify'
        }}
      />
    </Card>
  </div>
);

// Hakkında Şablonu
const AboutTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <div>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: 32,
      padding: '32px 0',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: page.imageUrl 
          ? `url("${page.imageUrl}") center/cover`
          : 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
        opacity: 0.1,
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <UserOutlined style={{ fontSize: '48px', color: 'white' }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            {page.title}
          </Title>
        </Space>
      </div>
    </div>

    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Title level={3} style={{ color: '#1890ff', marginBottom: 24, textAlign: 'center' }}>
        Hakkımızda
      </Title>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          textAlign: 'justify'
        }}
      />
    </Card>
  </div>
);

// Künyeli Bilgi Template
const CreditsTemplate: React.FC<{ page: Page }> = ({ page }) => (
  <div>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: 32,
      padding: '32px 0',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '80px',
        opacity: 0.1
      }}>
        <BankOutlined />
      </div>
      <Space direction="vertical" size="small">
        <BankOutlined style={{ fontSize: '32px', color: 'white' }} />
        <Title level={1} style={{ color: 'white', margin: 0 }}>
          {page.title}
        </Title>
      </Space>
    </div>

    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          textAlign: 'justify'
        }}
      />
    </Card>
  </div>
);

// Vizyon Misyon Değerler Template
const VisionMissionValuesTemplate: React.FC<{ page: Page }> = ({ page }) => {
  const [vision, setVision] = useState<Page | null>(null);
  const [mission, setMission] = useState<Page | null>(null);
  const [values, setValues] = useState<Page | null>(null);

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        const pages: Page[] = response.data.data;
        
        // Vizyon sayfasını bul
        const visionPage = pages.find(page => 
          page.slug === 'vizyon' || 
          page.title.toLowerCase().includes('vizyon') ||
          page.slug === 'vizyonumuz' ||
          page.slug.toLowerCase().includes('vizyon')
        );
        
        // Misyon sayfasını bul
        const missionPage = pages.find(page => 
          page.slug === 'misyon' || 
          page.title.toLowerCase().includes('misyon') ||
          page.slug === 'misyonumuz' ||
          page.slug.toLowerCase().includes('misyon')
        );
        
        // Değerlerimiz sayfasını bul
        const valuesPage = pages.find(page => 
          page.slug === 'degerlerimiz' || 
          page.title.toLowerCase().includes('değerlerimiz') ||
          page.slug === 'degerler' ||
          page.slug.toLowerCase().includes('değer')
        );
        
        setVision(visionPage || null);
        setMission(missionPage || null);
        setValues(valuesPage || null);
      }
    } catch (error) {
      console.error('Sayfa içerikleri yüklenirken hata:', error);
    }
  };

  // Loading durumunu kaldırdık - sayfa hemen yüklenir

  return (
    <div style={{ padding: '32px 0' }}>
      {/* Kurumsal Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 60,
        padding: window.innerWidth <= 768 ? '40px 20px' : '60px 40px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          opacity: 0.6
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          opacity: 0.4
        }} />
        <Space direction="vertical" size="large">
          <BankOutlined style={{ 
            fontSize: window.innerWidth <= 768 ? '36px' : '48px', 
            color: 'white', 
            opacity: 0.9 
          }} />
          <Title level={1} style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem', 
            fontWeight: 'bold',
            lineHeight: '1.2',
            wordBreak: 'break-word'
          }}>
            MİSYON, VİZYON VE DEĞERLER
          </Title>
        </Space>
      </div>

      {/* Modern Cards Grid - Misyon, Vizyon, Değerlerimiz sırası */}
      <Row gutter={[32, 32]} style={{ marginBottom: 60 }}>
        {/* Misyon */}
        <Col xs={24} lg={8}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.1)',
            border: '1px solid rgba(30, 58, 138, 0.1)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(30, 58, 138, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 58, 138, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '12px 12px 0 0'
            }} />
            <RocketOutlined style={{ fontSize: '32px', marginBottom: '20px', color: '#1e3a8a', opacity: 0.8 }} />
            <Title level={3} style={{ marginBottom: '20px', color: '#1e3a8a', fontWeight: 'bold' }}>
              {mission?.title || 'Misyonumuz'}
            </Title>
            {mission?.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: mission.content }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#374151',
                  textAlign: 'left'
                }}
              />
            ) : (
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#6b7280' }}>
                Admin panelinden misyon içeriği ekleyin.
              </Paragraph>
            )}
          </div>
        </Col>

        {/* Vizyon */}
        <Col xs={24} lg={8}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.1)',
            border: '1px solid rgba(30, 58, 138, 0.1)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(30, 58, 138, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 58, 138, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '12px 12px 0 0'
            }} />
            <EyeOutlined style={{ fontSize: '32px', marginBottom: '20px', color: '#1e3a8a', opacity: 0.8 }} />
            <Title level={3} style={{ marginBottom: '20px', color: '#1e3a8a', fontWeight: 'bold' }}>
              {vision?.title || 'Vizyonumuz'}
            </Title>
            {vision?.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: vision.content }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#374151',
                  textAlign: 'left'
                }}
              />
            ) : (
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#6b7280' }}>
                Admin panelinden vizyon içeriği ekleyin.
              </Paragraph>
            )}
          </div>
        </Col>

        {/* Değerlerimiz */}
        <Col xs={24} lg={8}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.1)',
            border: '1px solid rgba(30, 58, 138, 0.1)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(30, 58, 138, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 58, 138, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '12px 12px 0 0'
            }} />
            <BulbOutlined style={{ fontSize: '32px', marginBottom: '20px', color: '#1e3a8a', opacity: 0.8 }} />
            <Title level={3} style={{ marginBottom: '20px', color: '#1e3a8a', fontWeight: 'bold' }}>
              {values?.title || 'Değerlerimiz'}
            </Title>
            {values?.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: values.content }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#374151',
                  textAlign: 'left'
                }}
              />
            ) : (
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#6b7280' }}>
                Admin panelinden değerlerimiz içeriği ekleyin.
              </Paragraph>
            )}
          </div>
        </Col>
      </Row>

    </div>
  );
};

// Render Template - Komisyonlar ve Sektör Kurulları
const RenderTemplate: React.FC<{ page: Page }> = ({ page }) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [sectorBoards, setSectorBoards] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
    fetchSectorBoards();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await commissionApi.getAll();
      if (response.data.success) {
        // Sadece komisyonları filtrele (name'inde "Kurulu" geçmeyenler)
        const commissions = response.data.data.filter((commission: Commission) => 
          !commission.name.toLowerCase().includes('kurulu')
        );
        setCommissions(commissions);
      }
    } catch (error) {
      console.error('Komisyonlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectorBoards = async () => {
    try {
      const response = await commissionApi.getAll();
      if (response.data.success) {
        // Sektör kurullarını filtrele (name'inde "Kurulu" geçenler)
        const sectorBoards = response.data.data.filter((commission: Commission) => 
          commission.name.toLowerCase().includes('kurulu')
        );
        setSectorBoards(sectorBoards);
      }
    } catch (error) {
      console.error('Sektör kurulları yüklenirken hata:', error);
    }
  };

  // Komisyon profesyonel ikon eşleştirme fonksiyonu
  const getCommissionIcon = (commissionName: string) => {
    const name = commissionName.toLowerCase();
    
    // Tanıtım, İletişim ve Medya Komisyonu
    if (name.includes('tanıtım') || name.includes('iletişim') || name.includes('medya') || name.includes('basın')) {
      return <SoundOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Tarih ve Bilim Araştırmaları Komisyonu
    if (name.includes('tarih') || name.includes('bilim') || name.includes('araştırma') || name.includes('akademik')) {
      return <ExperimentOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    }
    
    // Sosyal Sorumluluk ve Dayanışma Komisyonu
    if (name.includes('sosyal') || name.includes('sorumluluk') || name.includes('dayanışma') || name.includes('yardımlaşma')) {
      return <HeartOutlined style={{ fontSize: '32px', color: '#f5222d' }} />;
    }
    
    // Ekonomi ve Ticaret Komisyonu
    if (name.includes('ekonomi') || name.includes('ticaret') || name.includes('ticari') || name.includes('finansal')) {
      return <DollarOutlined style={{ fontSize: '32px', color: '#faad14' }} />;
    }
    
    // Sanayi ve Üretim Komisyonu
    if (name.includes('sanayi') || name.includes('üretim') || name.includes('imalat') || name.includes('fabrika')) {
      return <BuildOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
    }
    
    // Ar-GE ve İnovasyon Komisyonu
    if (name.includes('ar-ge') || name.includes('inovasyon') || name.includes('araştırma') || name.includes('geliştirme') || name.includes('teknoloji')) {
      return <BulbOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />;
    }
    
    // Uluslararası İlişkiler ve Diplomasi Komisyonu
    if (name.includes('uluslararası') || name.includes('ilişkiler') || name.includes('diplomasi') || name.includes('dış') || name.includes('global')) {
      return <GlobalOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />;
    }
    
    // Genç İş İnsanları ve Girişimcilik Komisyonu
    if (name.includes('genç') || name.includes('girişimcilik') || name.includes('startup') || name.includes('yenilikçi')) {
      return <RocketOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />;
    }
    
    // Kültür, Eğitim ve Sosyal İlişkiler Komisyonu
    if (name.includes('kültür') || name.includes('eğitim') || name.includes('öğretim') || name.includes('sanat')) {
      return <BookOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Hukuk ve Mevzuat Komisyonu
    if (name.includes('hukuk') || name.includes('mevzuat') || name.includes('yasal') || name.includes('hukuki')) {
      return <BranchesOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
    }
    
    // Enerji, Çevre ve Sürdürülebilirlik Komisyonu
    if (name.includes('enerji') || name.includes('çevre') || name.includes('sürdürülebilirlik') || name.includes('yeşil') || name.includes('ekoloji')) {
      return <EnvironmentOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    }
    
    // İş Etiği ve Ahlak Komisyonu
    if (name.includes('etik') || name.includes('ahlak') || name.includes('değerler') || name.includes('moral')) {
      return <StarOutlined style={{ fontSize: '32px', color: '#faad14' }} />;
    }
    
    // Kadın İş İnsanları Komisyonu
    if (name.includes('kadın') || name.includes('kadınlar')) {
      return <WomanOutlined style={{ fontSize: '32px', color: '#fb2f96' }} />;
    }
    
    // Dijital Dönüşüm Komisyonu
    if (name.includes('dijital') || name.includes('dönüşüm') || name.includes('teknoloji') || name.includes('yapay zeka')) {
      return <RobotOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />;
    }
    
    // Turizm ve Seyahat Komisyonu
    if (name.includes('turizm') || name.includes('seyahat') || name.includes('seyahat')) {
      return <CarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Sağlık ve Sosyal Güvenlik Komisyonu
    if (name.includes('sağlık') || name.includes('güvenlik') || name.includes('medikal')) {
      return <SafetyOutlined style={{ fontSize: '32px', color: '#f5222d' }} />;
    }
    
    // Varsayılan ikon
    return <BankOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
  };

  // Sektör kurulu profesyonel ikon eşleştirme fonksiyonu
  const getSectorBoardIcon = (boardName: string) => {
    const name = boardName.toLowerCase();
    
    // İnşaat ve Gayrimenkul Kurulu
    if (name.includes('inşaat') || name.includes('gayrimenkul') || name.includes('yapı')) {
      return <BuildOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
    }
    
    // Enerji ve Yenilenebilir Kaynaklar Kurulu
    if (name.includes('enerji') || name.includes('yenilenebilir') || name.includes('kaynaklar')) {
      return <ThunderboltOutlined style={{ fontSize: '32px', color: '#faad14' }} />;
    }
    
    // Tarım ve Gıda Sanayi Kurulu
    if (name.includes('tarım') || name.includes('gıda') || name.includes('sanayi')) {
      return <CrownOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    }
    
    // Sağlık ve Medikal Teknolojiler Kurulu
    if (name.includes('sağlık') || name.includes('medikal') || name.includes('teknolojiler')) {
      return <MedicineBoxOutlined style={{ fontSize: '32px', color: '#f5222d' }} />;
    }
    
    // Savunma ve Güvenlik Teknolojileri Kurulu
    if (name.includes('savunma') || name.includes('güvenlik') || name.includes('teknolojileri')) {
      return <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Yazılım, Bilişim ve Yapay Zeka Kurulu
    if (name.includes('yazılım') || name.includes('bilişim') || name.includes('yapay zeka') || name.includes('yapay zeka')) {
      return <LaptopOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />;
    }
    
    // Eğitim ve Üniversite-Sanayi İşbirliği Kurulu
    if (name.includes('eğitim') || name.includes('üniversite') || name.includes('işbirliği')) {
      return <BookOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Lojistik ve Ulaştırma Kurulu
    if (name.includes('lojistik') || name.includes('ulaştırma') || name.includes('ulaşım')) {
      return <TruckOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />;
    }
    
    // Finans, Yatırım ve Bankacılık Kurulu
    if (name.includes('finans') || name.includes('yatırım') || name.includes('bankacılık')) {
      return <MoneyCollectOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    }
    
    // Kadın Girişimciler Kurulu
    if (name.includes('kadın') && name.includes('girişimciler')) {
      return <WomanOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />;
    }
    
    // Genç Girişimciler Kurulu
    if (name.includes('genç') && name.includes('girişimciler')) {
      return <RocketOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />;
    }
    
    // Ortadoğu Ülkeleri Koordinasyon Kurulu
    if (name.includes('ortadoğu') || name.includes('koordinasyon') || name.includes('ülkeleri')) {
      return <GlobalOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />;
    }
    
    // Karbon Ayak İzi ve Sürdürülebilirlik Kurulu
    if (name.includes('karbon') || name.includes('ayak izi') || name.includes('sürdürülebilirlik')) {
      return <EnvironmentOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    }
    
    // Madencilik ve Doğal Kaynaklar Kurulu
    if (name.includes('madencilik') || name.includes('doğal kaynaklar') || name.includes('maden')) {
      return <ToolIcon style={{ fontSize: '32px', color: '#722ed1' }} />;
    }
    
    // Tekstil, Moda ve Tasarım Kurulu
    if (name.includes('tekstil') || name.includes('moda') || name.includes('tasarım')) {
      return <PictureOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />;
    }
    
    // Kimya, İlaç ve Kozmetik Sanayi Kurulu
    if (name.includes('kimya') || name.includes('ilaç') || name.includes('kozmetik')) {
      return <ExperimentOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />;
    }
    
    // Metal, Makine ve Otomotiv Sanayi Kurulu
    if (name.includes('metal') || name.includes('makine') || name.includes('otomotiv')) {
      return <CarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Mimarlık, Şehircilik ve Kentsel Dönüşüm Kurulu
    if (name.includes('mimarlık') || name.includes('şehircilik') || name.includes('kentsel')) {
      return <HomeOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
    }
    
    // İklim Değişikliği ve Çevre Teknolojileri Kurulu
    if (name.includes('iklim') || name.includes('çevre') || name.includes('teknolojileri')) {
      return <CloudOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />;
    }
    
    // E-ticaret ve Dijital Ekonomi Kurulu
    if (name.includes('e-ticaret') || name.includes('dijital') || name.includes('ekonomi')) {
      return <ShoppingOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    }
    
    // Sosyal Politikalar ve İnsan Kaynakları Kurulu
    if (name.includes('sosyal') || name.includes('politikalar') || name.includes('insan kaynakları')) {
      return <UsergroupAddOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    }
    
    // Kültür, Sanat ve Kreatif Endüstriler Kurulu
    if (name.includes('kültür') || name.includes('sanat') || name.includes('kreatif')) {
      return <PictureOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />;
    }
    
    // Fuar, Organizasyon ve Etkinlik Kurulu
    if (name.includes('fuar') || name.includes('organizasyon') || name.includes('etkinlik')) {
      return <CalendarOutlined style={{ fontSize: '32px', color: '#faad14' }} />;
    }
    
    // Varsayılan ikon
    return <BankOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
  };

  return (
    <div style={{ padding: '32px 0' }}>
      {/* Hero Section */}
        <div style={{
        textAlign: 'center', 
        marginBottom: 48,
        padding: '32px 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '8px'
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
              {page.title}
            </Title>
        <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
          {page.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            'Dinamik içerik gösterimi - Komisyonlar ve sektör kurulları'
          )}
        </Paragraph>
          </div>

      <Spin spinning={loading}>
        <Tabs 
          defaultActiveKey="1" 
          size="large"
            style={{
            width: '100%',
            maxWidth: '100%',
            minHeight: '150vh',
            overflow: 'hidden'
          }}
          tabBarStyle={{
            width: '100%',
            padding: '0 20px'
          }}
          items={[
            {
              key: '1',
              label: 'Komisyonlar',
              children: (
                commissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <BankOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: '#999' }}>Henüz komisyon eklenmemiş</Title>
                    <Paragraph style={{ color: '#999' }}>
                      Komisyonlar admin panelinden eklenebilir.
                    </Paragraph>
                  </div>
                ) : (
                  <div>
                    {/* Komisyonlar İstatistikleri */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                      <Col span={24}>
                        <Card size="small" style={{ background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', color: 'white', border: 'none' }}>
                          <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ color: 'white', margin: 0 }}>
                              {commissions.length} Komisyon
                            </Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                              Aktif komisyonlar
                            </Paragraph>
                          </div>
                        </Card>
                      </Col>
                    </Row>

                    {/* Komisyonlar */}
                    <Row gutter={[24, 24]}>
                      {commissions
                        .sort((a, b) => a.order - b.order)
                        .map((commission) => (
                          <Col xs={24} sm={12} lg={8} key={commission.id}>
                            <Card
                              hoverable
                              style={{ 
                                height: '100%',
          borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                              }}
                              bodyStyle={{ padding: '24px' }}
                            >
                              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <div style={{ marginBottom: 12 }}>
                                  {getCommissionIcon(commission.name)}
                                </div>
                                <Title level={4} style={{ margin: '0 0 8px 0', color: '#262626' }}>
                                  {commission.name}
                                </Title>
                              </div>
                              
                              <Divider style={{ margin: '16px 0' }} />

                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: 4 }}>Başkan</div>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{commission.chairman}</div>
                              </div>

                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: 4 }}>Başkan Yardımcısı</div>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{commission.viceChairman}</div>
                              </div>

                              {commission.members && (
                                <div>
                                  <div style={{ fontSize: '12px', color: '#999', marginBottom: 4 }}>Üyeler</div>
                                  <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                                    {commission.members.split(',').map((member, index) => (
                                      <span key={index}>
                                        {member.trim()}
                                        {index < commission.members!.split(',').length - 1 && ', '}
                                      </span>
                                    ))}
                                  </div>
        </div>
      )}
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  </div>
                )
              )
            },
            {
              key: '2',
              label: 'Sektör Kurulları',
              children: (
                sectorBoards.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <BankOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: '#999' }}>Henüz sektör kurulu eklenmemiş</Title>
                    <Paragraph style={{ color: '#999' }}>
                      Sektör kurulları admin panelinden eklenebilir.
                    </Paragraph>
                  </div>
                ) : (
                  <div>
                    {/* Sektör Kurulları İstatistikleri */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                      <Col span={24}>
                        <Card size="small" style={{ background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', color: 'white', border: 'none' }}>
                          <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ color: 'white', margin: 0 }}>
                              {sectorBoards.length} Sektör Kurulu
                            </Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                              Aktif sektör kurulları
                            </Paragraph>
                          </div>
                        </Card>
                      </Col>
                    </Row>

                    {/* Sektör Kurulları */}
                    <Row gutter={[24, 24]}>
                      {sectorBoards
                        .sort((a, b) => a.order - b.order)
                        .map((board) => (
                          <Col xs={24} sm={12} lg={8} key={board.id}>
                            <Card
                              hoverable
                              style={{ 
                                height: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                              }}
                              bodyStyle={{ padding: '24px' }}
                            >
                              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <div style={{ marginBottom: 12 }}>
                                  {getSectorBoardIcon(board.name)}
                                </div>
                                <Title level={4} style={{ margin: '0 0 8px 0', color: '#262626' }}>
                                  {board.name}
                                </Title>
                              </div>
                              
                              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                                <div style={{ marginBottom: 8 }}>
                                  <strong style={{ color: '#262626' }}>Başkan:</strong>
                                  <Paragraph style={{ margin: '4px 0', color: '#666' }}>
                                    {board.chairman}
                                  </Paragraph>
                                </div>
                                {board.viceChairman && (
                                  <div style={{ marginBottom: 8 }}>
                                    <strong style={{ color: '#262626' }}>Başkan Yardımcısı:</strong>
                                    <Paragraph style={{ margin: '4px 0', color: '#666' }}>
                                      {board.viceChairman}
                                    </Paragraph>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  </div>
                )
              )
            }
          ]}
        />
      </Spin>
    </div>
  );
};

// Başkanın Mesajı Template
const PresidentsMessageTemplate: React.FC<{ page: Page }> = ({ page }) => {
  return (
    <div style={{ padding: '32px 0' }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 48,
        padding: '32px 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: page.imageUrl 
            ? `url("${page.imageUrl}") center/cover`
            : 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
          opacity: 0.1,
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <UserOutlined style={{ fontSize: '48px', color: 'white' }} />
            <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
              {page.title}
            </Title>
          </Space>
        </div>
      </div>

      {/* Başkanın Mesajı Card */}
      <Row justify="center">
        <Col xs={24} lg={20} xl={16}>
          <Card style={{
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
            border: 'none',
            overflow: 'hidden'
          }}>
            <Row gutter={[40, 40]} align="middle">
              {/* Başkan Fotoğrafı */}
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                }}>
                  {page.imageUrl ? (
                    <Image
                      src={page.imageUrl}
                      alt="Başkan Fotoğrafı"
                      style={{
                        width: '280px',
                        height: '350px',
                        objectFit: 'cover',
                        borderRadius: '16px'
                      }}
                      preview={false}
                    />
                  ) : (
                    <div style={{
                      width: '280px',
                      height: '350px',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #cbd5e1'
                    }}>
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>
                          Başkan Fotoğrafı
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '8px' }}>
                          Admin panelinden yükleyin
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Alt bilgi */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                    color: 'white',
                    padding: '20px 16px 16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                      Kurumsal Web Sitesi Başkanı
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      Tüm Ortadoğu Sanayici ve İş Adamları Derneği
                    </div>
                  </div>
                </div>
              </Col>

              {/* Mesaj İçeriği */}
              <Col xs={24} md={16}>
                <div style={{ padding: '20px 0' }}>
                  {page.content ? (
          <div 
            dangerouslySetInnerHTML={{ __html: page.content }}
            style={{
                        fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151',
                        textAlign: 'justify',
                        textIndent: '2em'
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      color: '#6b7280',
                      textAlign: 'center',
                      fontStyle: 'italic',
                      padding: '40px 20px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '2px dashed #e2e8f0'
                    }}>
                      Admin panelinden başkanın mesajını ekleyin.
        </div>
      )}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PageRenderer;
