import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  message,
  Space,
  Divider
} from 'antd';
import { 
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { ContactInfo, Page } from '../../types';
import { contactApi, pagesApi } from '../../services/api';
import GoogleMap from '../../components/GoogleMap';
import DynamicCard from '../../components/DynamicCard';
import { ReactComponent as InstagramIcon } from '../../assets/instagram.svg';
import { ReactComponent as FacebookIcon } from '../../assets/facebook-alt.svg';
import { ReactComponent as TwitterIcon } from '../../assets/twitter.svg';
import { ReactComponent as LinkedInIcon } from '../../assets/linkedin.svg';
import { ReactComponent as YouTubeIcon } from '../../assets/youtube.svg';
import { ReactComponent as WhatsAppIcon } from '../../assets/whatsapp.svg';
import { ReactComponent as TelegramIcon } from '../../assets/telegram.svg';
import { ReactComponent as NSosyalIcon } from '../../assets/nsosyal.svg';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Iletisim: React.FC = () => {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContactInfos();
    fetchPageContent();
  }, []);

  const fetchContactInfos = async () => {
    try {
      const response = await contactApi.getInfo();
      if (response.data.success) {
        setContactInfos(response.data.data);
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenirken hata:', error);
    }
  };

  const fetchPageContent = async () => {
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        // İletişim sayfasını bul (slug: 'iletisim' veya title: 'İletişim')
        const iletisimPage = response.data.data.find(
          (page: Page) => page.slug === 'iletisim' || page.title.toLowerCase().includes('iletişim')
        );
        setPageContent(iletisimPage || null);
      }
    } catch (error) {
      console.error('Sayfa içeriği yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Burada form verilerini backend'e gönderebilirsiniz
      console.log('Form verileri:', values);
      
      // Simüle edilmiş başarı mesajı
      setTimeout(() => {
        message.success('Mesajınız başarıyla gönderildi!');
        form.resetFields();
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Mesaj gönderilirken hata oluştu');
      setLoading(false);
    }
  };

  const getContactInfo = (type: string) => {
    return contactInfos.find(info => info.type === type);
  };

  const getIcon = (type: string, label?: string) => {
    switch (type) {
      case 'phone':
        return <PhoneOutlined style={{ fontSize: '24px', color: '#52c41a' }} />;
      case 'email':
        return <MailOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
      case 'address':
        return <EnvironmentOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />;
      case 'social':
        return getSocialIcon(label || '');
      default:
        return <ClockCircleOutlined style={{ fontSize: '24px', color: '#722ed1' }} />;
    }
  };

  const getSocialIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    const iconStyle = { width: '24px', height: '24px', color: '#722ed1' };
    
    if (lowerLabel.includes('instagram')) {
      return <InstagramIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('facebook')) {
      return <FacebookIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('twitter') || lowerLabel.includes('x')) {
      return <TwitterIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('linkedin')) {
      return <LinkedInIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('youtube')) {
      return <YouTubeIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('whatsapp')) {
      return <WhatsAppIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('telegram')) {
      return <TelegramIcon style={iconStyle} />;
    }
    if (lowerLabel.includes('nsosyal')) {
      return <NSosyalIcon style={iconStyle} />;
    }
    
    // Varsayılan icon
    return <GlobalOutlined style={{ fontSize: '24px', color: '#722ed1' }} />;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 32,
        padding: '32px 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '8px'
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          {pageContent?.title || 'İletişim'}
        </Title>
        {pageContent?.content && (
          <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
            <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
          </Paragraph>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* İletişim Bilgileri */}
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              İletişim
            </Title>
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* Adres */}
              {getContactInfo('address') && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {getIcon('address')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1890ff' }}>
                      Adres
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                      {getContactInfo('address')?.value}
                    </div>
                  </div>
                </div>
              )}

              {/* Telefon */}
              {getContactInfo('phone') && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {getIcon('phone')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1890ff' }}>
                      Telefon
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <a href={`tel:${getContactInfo('phone')?.value}`} style={{ color: '#1890ff' }}>
                        {getContactInfo('phone')?.value}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* E-posta */}
              {getContactInfo('email') && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {getIcon('email')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1890ff' }}>
                      E-posta
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <a href={`mailto:${getContactInfo('email')?.value}`} style={{ color: '#1890ff' }}>
                        {getContactInfo('email')?.value}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Sosyal Medya */}
              {contactInfos.filter(info => info.type === 'social').map((socialInfo) => (
                <div key={socialInfo.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {getIcon('social', socialInfo.label)}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1890ff' }}>
                      {socialInfo.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {socialInfo.url && socialInfo.url.startsWith('http') ? (
                        <a 
                          href={socialInfo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#1890ff' }}
                        >
                          {socialInfo.value}
                        </a>
                      ) : (
                        <span style={{ opacity: 0.6 }}>{socialInfo.value}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Çalışma Saatleri */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {getIcon('clock')}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1890ff' }}>
                    Çalışma Saatleri
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                    {getContactInfo('working-hours')?.value || 'Pazartesi - Cuma: 09:00 - 18:00'}
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* İletişim Formu */}
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <Title level={3} style={{ marginBottom: 12 }}>
              Mesaj Gönder
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="name"
                label="Ad Soyad"
                rules={[
                  { required: true, message: 'Ad soyad gerekli' },
                  { min: 2, message: 'En az 2 karakter olmalı' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />}
                  placeholder="Adınız ve soyadınız"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-posta"
                rules={[
                  { required: true, message: 'E-posta gerekli' },
                  { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />}
                  placeholder="ornek@email.com"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Telefon"
                rules={[
                  { required: true, message: 'Telefon numarası gerekli' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />}
                  placeholder="+90 5XX XXX XX XX"
                />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Konu"
                rules={[
                  { required: true, message: 'Konu gerekli' }
                ]}
              >
                <Input 
                  placeholder="Mesajınızın konusu"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Mesaj"
                rules={[
                  { required: true, message: 'Mesaj gerekli' },
                  { min: 10, message: 'En az 10 karakter olmalı' }
                ]}
              >
                <TextArea 
                  rows={4}
                  placeholder="Mesajınızı buraya yazın..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SendOutlined />}
                  block
                >
                  Mesaj Gönder
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

      </Row>

      {/* Harita - Tam Genişlik */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card style={{ padding: '16px' }}>
            <Title level={3} style={{ marginBottom: 8, marginTop: 0 }}>
              Konum
            </Title>
            {(() => {
              // Adres bilgisini contactInfos'tan al
              const addressInfo = contactInfos.find(info => info.type === 'address');
              const address = addressInfo?.value || 'İstanbul, Türkiye';
              
              // Koordinatları al, yoksa varsayılan İstanbul koordinatları
              const center = addressInfo?.latitude && addressInfo?.longitude 
                ? { lat: addressInfo.latitude, lng: addressInfo.longitude }
                : { lat: 41.0082, lng: 28.9784 };
              
              return (
                <div style={{ height: 600, borderRadius: '8px', overflow: 'hidden' }}>
                  <GoogleMap
                    center={center}
                    zoom={15}
                    address={address}
                    height={600}
                  />
                </div>
              );
            })()}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Iletisim;
