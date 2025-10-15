import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Güvenli şifre hash'i (SHA-256) - KurumsalWebSitesi2025!
  const ADMIN_PASSWORD_HASH = '3e1919eca83e3b313e2772a83f30a41ffb33d332e5695a4e792e015437da898a';

  // SHA-256 hash fonksiyonu
  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const onFinish = async (values: { password: string }) => {
    setLoading(true);
    
    try {
      // Girilen şifreyi hash'le
      const inputHash = await sha256(values.password);
      
      // Hash'leri karşılaştır
      if (inputHash === ADMIN_PASSWORD_HASH) {
        // Session storage'a admin durumunu kaydet
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now().toString());
        
        message.success('Giriş başarılı!');
        navigate('/yonetim');
      } else {
        message.error('Hatalı şifre!');
      }
    } catch (error) {
      message.error('Giriş sırasında hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)'
          }}>
            <LockOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1e3a8a' }}>
            Admin Girişi
          </Title>
          <Text type="secondary">
            Yönetim paneline erişim için şifrenizi girin
          </Text>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Şifre gereklidir!' },
              { min: 6, message: 'Şifre en az 6 karakter olmalıdır!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Admin şifresi"
              style={{
                borderRadius: '8px',
                height: 48,
                fontSize: 16
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
              }}
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space direction="vertical" size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>
              Güvenlik için şifrenizi kimseyle paylaşmayın
            </Text>
            <Button 
              type="link" 
              onClick={() => navigate('/')}
              style={{ padding: 0, fontSize: 14 }}
            >
              Ana sayfaya dön
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
