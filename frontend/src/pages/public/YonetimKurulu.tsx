import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Avatar,
  Divider,
  Spin,
  Space
} from 'antd';
import { CrownOutlined, TeamOutlined } from '@ant-design/icons';
import { OrganizationMember } from '../../types';
import { organizationApi } from '../../services/api';
import { getMemberImageUrl } from '../../utils/imageUrl';

const { Title, Paragraph } = Typography;

const YonetimKurulu: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await organizationApi.getMembers();
      if (response.data.success) {
        // Yönetim kurulu üyelerini filtrele
        const boardMembers = response.data.data.filter((member: OrganizationMember) => 
          member.category === 'board' || member.category === 'founder'
        );
        setMembers(boardMembers);
      }
    } catch (error) {
      console.error('Yönetim kurulu üyeleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Başkanı bul
  const chairman = members.find(member => 
    member.position?.toLowerCase().includes('başkan') || 
    member.position?.toLowerCase().includes('chairman')
  );

  // Diğer üyeler
  const otherMembers = members.filter(member => member !== chairman);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Paragraph>Yönetim kurulu üyeleri yükleniyor...</Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0' }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 48,
        padding: '40px 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '12px',
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
          <TeamOutlined />
        </div>
        <Space direction="vertical" size="small">
          <TeamOutlined style={{ fontSize: '32px', color: 'white' }} />
          <Title level={1} style={{ color: 'white', margin: 0 }}>
            Yönetim Kurulu
          </Title>
          <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
            Kurumsal Web Sitesi Yönetim Kurulu üyeleri ve başkanı
          </Paragraph>
        </Space>
      </div>

      {/* Başkan */}
      {chairman && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <CrownOutlined style={{ fontSize: '24px', color: '#faad14', marginRight: '8px' }} />
            <Title level={2} style={{ margin: 0, display: 'inline' }}>
              Başkan
            </Title>
          </div>
          
          <Row justify="center">
            <Col xs={24} sm={16} md={12} lg={8}>
              <Card
                style={{
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '2px solid #faad14'
                }}
                bodyStyle={{ padding: '32px' }}
              >
                <Avatar
                  size={120}
                  src={chairman.imageUrl ? getMemberImageUrl(chairman.imageUrl) : undefined}
                  style={{ 
                    marginBottom: 24,
                    border: '4px solid #faad14',
                    backgroundColor: '#faad14'
                  }}
                >
                  {chairman.name?.charAt(0)}
                </Avatar>
                
                <Title level={3} style={{ marginBottom: 8, color: '#1e3a8a' }}>
                  {chairman.name}
                </Title>
                
                <Paragraph style={{ 
                  fontSize: '16px', 
                  color: '#faad14', 
                  fontWeight: 'bold',
                  marginBottom: 16
                }}>
                  {chairman.position}
                </Paragraph>
                
                {chairman.department && (
                  <Paragraph style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: 16
                  }}>
                    {chairman.department}
                  </Paragraph>
                )}
                
                {chairman.bio && (
                  <Paragraph style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    textAlign: 'justify',
                    lineHeight: '1.6'
                  }}>
                    {chairman.bio}
                  </Paragraph>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Diğer Üyeler */}
      {otherMembers.length > 0 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <TeamOutlined style={{ fontSize: '24px', color: '#1e3a8a', marginRight: '8px' }} />
            <Title level={2} style={{ margin: 0, display: 'inline' }}>
              Yönetim Kurulu Üyeleri
            </Title>
          </div>
          
          <Row gutter={[24, 24]} justify="center">
            {otherMembers.map((member) => (
              <Col key={member.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  style={{
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '24px' }}
                  hoverable
                >
                  <Avatar
                    size={80}
                    src={member.imageUrl ? getMemberImageUrl(member.imageUrl) : undefined}
                    style={{ 
                      marginBottom: 16,
                      backgroundColor: '#1e3a8a'
                    }}
                  >
                    {member.name?.charAt(0)}
                  </Avatar>
                  
                  <Title level={4} style={{ marginBottom: 8, color: '#1e3a8a' }}>
                    {member.name}
                  </Title>
                  
                  <Paragraph style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    fontWeight: 'bold',
                    marginBottom: 8
                  }}>
                    {member.position}
                  </Paragraph>
                  
                  {member.department && (
                    <Paragraph style={{ 
                      fontSize: '12px', 
                      color: '#999',
                      marginBottom: 12
                    }}>
                      {member.department}
                    </Paragraph>
                  )}
                  
                  {member.bio && (
                    <Paragraph 
                      style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        textAlign: 'justify',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {member.bio}
                    </Paragraph>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Üye Bulunamadı */}
      {members.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <TeamOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: 16 }} />
          <Title level={3} style={{ color: '#999' }}>
            Yönetim Kurulu Üyesi Bulunamadı
          </Title>
          <Paragraph style={{ color: '#999' }}>
            Henüz yönetim kurulu üyesi eklenmemiş.
          </Paragraph>
        </Card>
      )}
    </div>
  );
};

export default YonetimKurulu;
