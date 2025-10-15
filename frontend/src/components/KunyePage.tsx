import React from 'react';
import { Card, Typography, Row, Col, Tag } from 'antd';
import DynamicCard from './DynamicCard';

const { Title, Paragraph } = Typography;

const KunyePage: React.FC = () => {
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
          Künye
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
          Kurumsal Web Sitesi hakkında detaylı bilgiler
        </Paragraph>
      </div>

      {/* Dinamik Organizasyon Kartı */}
      <DynamicCard variant="page" />

      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ color: '#1e3a8a', marginBottom: 16 }}>
                Kurumsal Web Sitesi
              </Title>
              <Title level={3} style={{ color: '#666', marginBottom: 24 }}>
                Tüm Ortadoğu Sanayici ve İş Adamları Derneği
              </Title>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ textAlign: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Kurumsal Web Sitesi Logo" 
                style={{ 
                  maxWidth: '200px', 
                  height: 'auto',
                  borderRadius: '8px'
                }} 
              />
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 32 }}>
          <Paragraph style={{ 
            fontSize: '16px', 
            lineHeight: '1.8', 
            color: '#666', 
            textAlign: 'justify',
            marginBottom: 24
          }}>
            Ortadoğu bölgesinde ekonomik ve kültürel işbirliklerini geliştirmek amacıyla kurulan derneğimiz, 
            bölge ülkeleri arasında güçlü ticari ve sosyal bağlar kurarak ekonomik kalkınmaya katkıda bulunmaktadır. 
            İş dünyasının önde gelen aktörlerini bir araya getirerek, sürdürülebilir işbirlikleri oluşturuyoruz.
          </Paragraph>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Row gutter={[16, 16]} justify="center">
              <Col>
                <Tag color="blue" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  🌍 Ortadoğu İşbirliği
                </Tag>
              </Col>
              <Col>
                <Tag color="green" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  🤝 Ticari ve Kültürel Ağ
                </Tag>
              </Col>
              <Col>
                <Tag color="orange" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  📈 Ekonomik Kalkınma
                </Tag>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KunyePage;
