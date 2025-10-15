import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { motion } from 'framer-motion';
import { siteSettingsApi, logoApi } from '../services/api';
import { getLogoImageUrl } from '../utils/imageUrl';
import { Logo } from '../types';

const { Title, Text } = Typography;

interface DynamicCardProps {
  variant?: 'homepage' | 'page';
  className?: string;
}

interface CardSettings {
  organizationName: string;
  organizationFullName: string;
  organizationDescription: string;
  organizationTags: string;
  cardLogoUrl?: string;
}

const DynamicCard: React.FC<DynamicCardProps> = ({ variant = 'page', className }) => {
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    organizationName: 'Kurumsal Web Sitesi',
    organizationFullName: 'Tüm Ortadoğu Sanayici ve İş Adamları Derneği',
    organizationDescription: 'Ortadoğu bölgesinde ticari ve sanayi işbirliğini geliştirmek için kurulmuş derneğimiz, bölge ülkeleri arasında güçlü ticari bağlar kurarak ekonomik kalkınmaya katkıda bulunmaktadır. İş dünyasının önde gelen isimlerini bir araya getirerek, sürdürülebilir ticari ilişkiler ve karşılıklı fayda sağlayan işbirlikleri oluşturuyoruz.',
    organizationTags: '🌍 Ortadoğu İşbirliği,🤝 Ticari Ağ,📈 Ekonomik Kalkınma'
  });
  const [headerLogo, setHeaderLogo] = useState<Logo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      setIsLoading(true);
      // Kart ayarlarını ve header logoyu paralel olarak çek
      const [nameResponse, fullNameResponse, descriptionResponse, tagsResponse, logoResponse, cardLogoResponse] = await Promise.all([
        siteSettingsApi.getByKey('card_organization_name'),
        siteSettingsApi.getByKey('card_organization_full_name'),
        siteSettingsApi.getByKey('card_organization_description'),
        siteSettingsApi.getByKey('card_organization_tags'),
        logoApi.getByType('header'),
        siteSettingsApi.getByKey('card_logo_url')
      ]);

      const settings: CardSettings = {
        organizationName: nameResponse.data.success ? nameResponse.data.data?.value || cardSettings.organizationName : cardSettings.organizationName,
        organizationFullName: fullNameResponse.data.success ? fullNameResponse.data.data?.value || cardSettings.organizationFullName : cardSettings.organizationFullName,
        organizationDescription: descriptionResponse.data.success ? descriptionResponse.data.data?.value || cardSettings.organizationDescription : cardSettings.organizationDescription,
        organizationTags: tagsResponse.data.success ? tagsResponse.data.data?.value || cardSettings.organizationTags : cardSettings.organizationTags,
        cardLogoUrl: cardLogoResponse.data.success ? cardLogoResponse.data.data?.value || '' : ''
      };

      setCardSettings(settings);

      if (logoResponse.data.success) {
        setHeaderLogo(logoResponse.data.data);
      }
    } catch (error) {
      console.error('Kart verileri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCard = () => {
    const tags = cardSettings.organizationTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const isHomepage = variant === 'homepage';
    
    // Loading state - kart yüklenirken hiçbir şey gösterme
    if (isLoading) {
      return null;
    }
    
    return (
      <Card 
        className={className}
        style={{ 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
          overflow: 'hidden',
          marginBottom: isHomepage ? 48 : 32
        }}
        bodyStyle={{ padding: isHomepage ? '40px' : '32px' }}
      >
        <Row gutter={[isHomepage ? 32 : 24, isHomepage ? 32 : 24]} align="middle">
          <Col xs={24} md={isHomepage ? 16 : 16}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Title 
                level={isHomepage ? 2 : 3} 
                style={{ 
                  color: 'white', 
                  marginBottom: isHomepage ? 16 : 12,
                  fontSize: isHomepage ? '28px' : '24px',
                  fontWeight: 700
                }}
              >
                {cardSettings.organizationName}
              </Title>
              <Title 
                level={isHomepage ? 4 : 5} 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  marginBottom: isHomepage ? 20 : 16,
                  fontSize: isHomepage ? '18px' : '16px',
                  fontWeight: 500
                }}
              >
                {cardSettings.organizationFullName}
              </Title>
              <Text
                style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: isHomepage ? '16px' : '14px',
                  lineHeight: '1.6',
                  marginBottom: isHomepage ? 20 : 20,
                  display: 'block'
                }}
              >
                {cardSettings.organizationDescription}
              </Text>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tags.map((tag, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.15)', 
                      padding: '6px 12px', 
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </motion.div>
          </Col>
          <Col xs={24} md={isHomepage ? 8 : 8}>
            <div style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {cardSettings.cardLogoUrl ? (
                  <div style={{
                    width: isHomepage ? '120px' : '100px',
                    height: isHomepage ? '120px' : '100px',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={cardSettings.cardLogoUrl}
                      alt="Kart Logo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                ) : headerLogo ? (
                  <div style={{
                    width: isHomepage ? '120px' : '100px',
                    height: isHomepage ? '120px' : '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px'
                  }}>
                    <img
                      src={getLogoImageUrl(headerLogo.imageUrl)}
                      alt={headerLogo.altText || headerLogo.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: isHomepage ? '120px' : '100px',
                    height: isHomepage ? '120px' : '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <span style={{ 
                      fontSize: isHomepage ? '20px' : '18px', 
                      fontWeight: 'bold',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      {cardSettings.organizationName}
                    </span>
                  </div>
                )}
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: isHomepage ? '14px' : '12px',
                  fontWeight: 500
                }}>
                  {cardSettings.organizationFullName}
                </div>
              </motion.div>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return renderCard();
};

export default DynamicCard;
