import React, { useState, useEffect } from 'react';
import { Card, Typography, Space } from 'antd';
import { Page } from '../../types';
import { pagesApi } from '../../services/api';
import SEO from '../../components/SEO';
import DynamicCard from '../../components/DynamicCard';
import { 
  BankOutlined,
  BuildOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Hakkimizda: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    setLoading(true);
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        const pages: Page[] = response.data.data;
        
        // Ana içerik sayfasını bul
        const aboutPage = pages.find(page => 
          page.slug === 'hakkimizda-ana' || 
          page.title.toLowerCase().includes('hakkımızda ana') ||
          page.slug === 'hakkimizda-icerik' ||
          page.title.toLowerCase().includes('ana içerik') ||
          page.slug.toLowerCase().includes('hakkimizda')
        );
        
        setAboutContent(aboutPage?.content || null);
      }
    } catch (error) {
      console.error('Sayfa içerikleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <SEO 
        title="Hakkımızda"
        description="Kurumsal Web Sitesi hakkında - Kurumsal web sitesi şablonu ve yönetim paneli hakkında bilgiler."
        keywords="Kurumsal Web Sitesi hakkında, kurumsal web sitesi, şablon, yönetim paneli"
        url="/hakkimizda"
      />
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
          background: 'url("https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80") center/cover',
          opacity: 0.1,
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <BankOutlined style={{ fontSize: '64px', color: 'white' }} />
            <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
              Hakkımızda
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
              Kurumsal Web Sitesi hakkında detaylı bilgiler
            </Paragraph>
          </Space>
        </div>
      </div>

      {/* Dinamik Organizasyon Kartı */}
      <DynamicCard variant="page" />


      {/* Ana İçerik */}
      <Card style={{ marginTop: 48, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Space direction="vertical" size="small">
            <BuildOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <Title level={2} style={{ margin: 0 }}>
              Hakkımızda
            </Title>
          </Space>
        </div>
        <div 
          dangerouslySetInnerHTML={{ __html: aboutContent || `
            <p>Ortadoğu Sanayici ve İş Adamları Derneği, bölgedeki sanayici ve iş adamlarının ekonomik, kültürel ve sosyal alanda güçlenmesini sağlamak amacıyla kurulmuş, dinamik ve etkin bir sivil toplum kuruluşudur. Üyelerimiz arasında bilgi, deneyim ve iş birliği köprüleri oluşturarak, sürdürülebilir kalkınmayı destekleyen projeler geliştiriyoruz.</p>
            
            <p>Derneğimiz, sadece ekonomik iş birlikleriyle sınırlı kalmayıp, kültürel değerlerin korunması ve sosyal dayanışmanın artırılması konusunda da aktif rol almaktadır. Bölgedeki iş dünyasının rekabet gücünü artırmak ve uluslararası platformlarda güçlü bir temsil sağlamak temel hedeflerimiz arasındadır.</p>
            
            <p>Etik değerler, şeffaflık ve yenilikçilik ilkeleri doğrultusunda hareket eden Ortadoğu Sanayici ve İş Adamları Derneği, üyelerinin ve bölgenin sürdürülebilir bir geleceğe doğru ilerlemesine katkı sağlamayı amaçlamaktadır.</p>
          ` }}
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
};

export default Hakkimizda;