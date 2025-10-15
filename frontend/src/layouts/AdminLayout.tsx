import React from 'react';
import { Layout, Menu, theme, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  MenuOutlined,
  TeamOutlined,
  PhoneOutlined,
  GlobalOutlined,
  ApartmentOutlined,
  PictureOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  BankOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/yonetim',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/yonetim/hero-slides',
      icon: <PictureOutlined />,
      label: 'Hero Slides',
    },
    {
      key: '/yonetim/istatistikler',
      icon: <BarChartOutlined />,
      label: 'İstatistikler',
    },
    {
      key: '/yonetim/analytics',
      icon: <BarChartOutlined />,
      label: 'Web Analytics',
    },
    {
      key: '/yonetim/logolar',
      icon: <AppstoreOutlined />,
      label: 'Logolar',
    },
    {
      key: '/yonetim/kart-yonetimi',
      icon: <IdcardOutlined />,
      label: 'Kart Yönetimi',
    },
    {
      key: '/yonetim/haberler',
      icon: <FileTextOutlined />,
      label: 'Haberler',
    },
    {
      key: '/yonetim/sayfalar',
      icon: <FileTextOutlined />,
      label: 'Sayfalar',
    },
    {
      key: '/yonetim/menu',
      icon: <MenuOutlined />,
      label: 'Menü',
    },
    {
      key: '/yonetim/organizasyon',
      icon: <TeamOutlined />,
      label: 'Organizasyon',
    },
    {
      key: '/yonetim/komisyonlar',
      icon: <BankOutlined />,
      label: 'Komisyonlar',
    },
    {
      key: '/yonetim/iletisim',
      icon: <PhoneOutlined />,
      label: 'İletişim',
    },
    {
      key: '/yonetim/site-ayarlari',
      icon: <GlobalOutlined />,
      label: 'Site Ayarları',
    },
    {
      key: '/yonetim/organizasyon-sema',
      icon: <ApartmentOutlined />,
      label: 'Organizasyon Şeması',
    },
    {
      key: '/',
      icon: <GlobalOutlined />,
      label: 'Siteyi Görüntüle',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '/') {
      window.open(key, '_blank');
    } else {
      navigate(key);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminLoginTime');
    navigate('/admin/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ 
            padding: '0 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '64px'
          }}>
            Dernek Yönetim Paneli
          </div>
          <div style={{ padding: '0 24px' }}>
            <Space>
              <Button 
                type="primary" 
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Çıkış Yap
              </Button>
            </Space>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
