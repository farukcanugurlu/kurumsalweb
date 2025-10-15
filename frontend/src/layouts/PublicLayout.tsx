import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer, Typography, Spin, Skeleton } from 'antd';
import { MenuOutlined, UserOutlined, RightOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuItem, Logo, ContactInfo, Page } from '../types';
import { menuApi, logoApi, contactApi, pagesApi, siteSettingsApi } from '../services/api';
import { getLogoImageUrl } from '../utils/imageUrl';
import '../styles/animations.css';
import { 
  GlobalOutlined
} from '@ant-design/icons';
import { ReactComponent as InstagramIcon } from '../assets/instagram.svg';
import { ReactComponent as YoutubeIcon } from '../assets/youtube.svg';
import { ReactComponent as TwitterIcon } from '../assets/twitter.svg';
import { ReactComponent as FacebookIcon } from '../assets/facebook-alt.svg';
import { ReactComponent as LinkedinIcon } from '../assets/linkedin.svg';
import { ReactComponent as WhatsappIcon } from '../assets/whatsapp.svg';
import { ReactComponent as TelegramIcon } from '../assets/telegram.svg';
import { ReactComponent as EmailIcon } from '../assets/email.svg';
import { ReactComponent as PhoneIcon } from '../assets/phone.svg';
import { ReactComponent as LocationIcon } from '../assets/location.svg';
import { ReactComponent as NSosyalIcon } from '../assets/nsosyal.svg';


const SITE_NAME = 'Kurumsal Web Sitesi'; // Geçici placeholder - admin'den gelecek

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [headerLogo, setHeaderLogo] = useState<Logo | null>(null);
  const [footerLogo, setFooterLogo] = useState<Logo | null>(null);
  const [faviconLogo, setFaviconLogo] = useState<Logo | null>(null);
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [degerlerimizPage, setDegerlerimizPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardSettings, setCardSettings] = useState<{
    organizationName: string;
    organizationFullName: string;
    organizationDescription: string;
    organizationTags: string;
  }>({
    organizationName: 'Kurumsal Web Sitesi',
    organizationFullName: 'Tüm Ortadoğu Sanayici ve İş Adamları Derneği',
    organizationDescription: 'Ortadoğu bölgesinde ticari ve sanayi işbirliğini geliştirmek için kurulmuş derneğimiz, bölge ülkeleri arasında güçlü ticari bağlar kurarak ekonomik kalkınmaya katkıda bulunmaktadır.',
    organizationTags: '🌍 Ortadoğu İşbirliği,🤝 Ticari Ağ,📈 Ekonomik Kalkınma'
  });
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Favicon'u hemen ayarla - React logosunu engellemek için
    setImmediateFavicon();
    
    // Responsive state'i ayarla
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Uygulamayı başlat
    const initializeApp = async () => {
      try {
        // Favicon'u önce yükle
        await fetchFaviconFirst();
        
        // Tüm verileri paralel olarak yükle
        await Promise.all([
          fetchMenuItems(),
          fetchLogos(),
          fetchContactInfos(),
          fetchDegerlerimizPage(),
          fetchCardSettings()
        ]);
        
        // Ana sayfa için hero slides'i de yükle
        if (location.pathname === '/') {
          try {
            const heroSlidesResponse = await fetch('/api/hero-slides');
            if (heroSlidesResponse.ok) {
              const heroData = await heroSlidesResponse.json();
              if (heroData.success && heroData.data.length > 0) {
                // Hero slides yüklendi, ekstra bekleme yok
                console.log('Hero slides hazır');
              }
            }
          } catch (error) {
            console.log('Hero slides yüklenemedi, devam ediliyor...');
          }
        }
        
        // Minimum loading süresi için kısa bir delay
        await new Promise(resolve => setTimeout(resolve, 400));
        
      } catch (error) {
        console.error('Uygulama başlatılırken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Hemen favicon ayarla - Kurumsal Web Sitesi logosu
  const setImmediateFavicon = () => {
    // Tüm mevcut favicon linklerini kaldır
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    // Kurumsal Web Sitesi logosunu favicon olarak ekle
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = '/favicon.ico';
    document.head.appendChild(favicon);

    // Shortcut icon da ekle
    const shortcutFavicon = document.createElement('link');
    shortcutFavicon.rel = 'shortcut icon';
    shortcutFavicon.type = 'image/x-icon';
    shortcutFavicon.href = '/favicon.ico';
    document.head.appendChild(shortcutFavicon);
  };

  // Favicon'ı dinamik olarak ayarla
  useEffect(() => {
    if (faviconLogo?.imageUrl) {
      const faviconUrl = getLogoImageUrl(faviconLogo.imageUrl);
      updateFavicon(faviconUrl);
    }
  }, [faviconLogo]);

  // Favicon güncelleme fonksiyonu
  const updateFavicon = (faviconUrl: string) => {
    // Mevcut favicon linklerini kaldır
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    // Yeni favicon linkini ekle - güçlü ayarlar
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.type = 'image/x-icon';
    newLink.href = faviconUrl;
    document.head.appendChild(newLink);

    // Shortcut icon da ekle
    const shortcutLink = document.createElement('link');
    shortcutLink.rel = 'shortcut icon';
    shortcutLink.type = 'image/x-icon';
    shortcutLink.href = faviconUrl;
    document.head.appendChild(shortcutLink);

    // Apple touch icon da ekle
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = faviconUrl;
    document.head.appendChild(appleTouchIcon);

    // PNG versiyonu da ekle
    const pngLink = document.createElement('link');
    pngLink.rel = 'icon';
    pngLink.type = 'image/png';
    pngLink.href = faviconUrl;
    document.head.appendChild(pngLink);
  };

  // Favicon'u öncelikli olarak yükle
  const fetchFaviconFirst = async () => {
    try {
      const faviconResponse = await logoApi.getByType('favicon');
      if (faviconResponse.data.success) {
        const faviconData = faviconResponse.data.data;
        setFaviconLogo(faviconData);
        
        // Favicon'u hemen preload et
        const faviconUrl = getLogoImageUrl(faviconData.imageUrl);
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = faviconUrl;
        document.head.appendChild(preloadLink);
      }
    } catch (error) {
      console.error('Favicon yüklenirken hata:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await menuApi.getWithChildren();
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error('Menü yüklenirken hata:', error);
    }
  };

  const fetchLogos = async () => {
    try {
      // Header logo
      const headerResponse = await logoApi.getByType('header');
      if (headerResponse.data.success) {
        setHeaderLogo(headerResponse.data.data);
      }
    } catch (error) {
      console.error('Header logo yüklenirken hata:', error);
    }

    try {
      // Footer logo
      const footerResponse = await logoApi.getByType('footer');
      if (footerResponse.data.success) {
        setFooterLogo(footerResponse.data.data);
      }
    } catch (error) {
      console.error('Footer logo yüklenirken hata:', error);
    }

  };

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

  const fetchDegerlerimizPage = async () => {
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        // Değerlerimiz sayfasını bul
        const degerlerimizPage = response.data.data.find(
          (page: Page) => 
            page.slug === 'degerlerimiz' || 
            page.title.toLowerCase().includes('değerlerimiz') ||
            page.title.toLowerCase().includes('degerlerimiz')
        );
        setDegerlerimizPage(degerlerimizPage || null);
      }
    } catch (error) {
      console.error('Değerlerimiz sayfası yüklenirken hata:', error);
    }
  };

  const fetchCardSettings = async () => {
    try {
      const [nameResponse, fullNameResponse, descriptionResponse, tagsResponse] = await Promise.all([
        siteSettingsApi.getByKey('card_organization_name'),
        siteSettingsApi.getByKey('card_organization_full_name'),
        siteSettingsApi.getByKey('card_organization_description'),
        siteSettingsApi.getByKey('card_organization_tags')
      ]);

      const settings = {
        organizationName: nameResponse.data.success ? nameResponse.data.data?.value || cardSettings.organizationName : cardSettings.organizationName,
        organizationFullName: fullNameResponse.data.success ? fullNameResponse.data.data?.value || cardSettings.organizationFullName : cardSettings.organizationFullName,
        organizationDescription: descriptionResponse.data.success ? descriptionResponse.data.data?.value || cardSettings.organizationDescription : cardSettings.organizationDescription,
        organizationTags: tagsResponse.data.success ? tagsResponse.data.data?.value || cardSettings.organizationTags : cardSettings.organizationTags
      };

      setCardSettings(settings);
    } catch (error) {
      console.error('Kart ayarları yüklenirken hata:', error);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    setDrawerVisible(false);
  };

  // Sadece ana menüleri al (parentId null olan) ve dropdown'ları filtrele
  const mainMenuItems = menuItems.filter(item => item.parentId === null);
  
  const menuItemsForAntd = mainMenuItems.map(item => {
    const menuItem = {
      key: item.url,
      label: item.title,
      style: { 
        fontSize: isMobile ? '16px' : '15px',
        fontWeight: '600',
        padding: isMobile ? '12px 20px' : '8px 16px',
        margin: '0 4px',
        borderRadius: '8px',
        color: '#475569',
        transition: 'all 0.3s ease',
        height: 'auto',
        lineHeight: '1.4'
      }
    };

    // Alt menü öğeleri varsa ekle
    if (item.children && item.children.length > 0) {
      return {
        ...menuItem,
        children: item.children.map(child => ({
          key: child.url,
          label: child.title,
          style: { 
            fontSize: isMobile ? '15px' : '14px',
            fontWeight: '500',
            color: '#64748b',
            transition: 'all 0.3s ease',
            padding: isMobile ? '10px 20px 10px 40px' : '8px 12px',
            height: 'auto',
            lineHeight: '1.4'
          }
        })),
        // Ana menü öğesini tıklanamaz yap ama görünümünü koru
        disabled: false,
        style: { 
          color: '#1890ff',
          fontWeight: '600',
          cursor: 'default'
        },
        onTitleClick: () => {
          // Ana öğeye tıklamayı engelle
          return false;
        }
      };
    }

    return menuItem;
  });

  // Loading durumunda skeleton göster
  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'white',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header Skeleton */}
          <div style={{ 
            height: '100px', 
            background: 'rgba(255, 255, 255, 0.95)',
            borderBottom: '1px solid rgba(30, 58, 138, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between'
          }}>
            <Skeleton.Button active size="large" style={{ width: 200, height: 40 }} />
            <Skeleton.Button active size="large" style={{ width: 120, height: 40 }} />
          </div>
          
          {/* Content Skeleton */}
          <div style={{ flex: 1, padding: '24px' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
          
          {/* Footer Skeleton */}
          <div style={{ 
            height: '200px', 
            background: '#1e3a8a',
            padding: '24px'
          }}>
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div>
        <Header style={{ 
          position: 'fixed', 
          zIndex: 1000, 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(25px)',
          boxShadow: '0 4px 32px rgba(30, 58, 138, 0.15)',
          padding: '0',
          borderBottom: '1px solid rgba(30, 58, 138, 0.08)',
          height: isMobile ? '70px' : '100px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'space-between',
            height: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: isMobile ? '0 16px' : '0 32px'
          }}>
            {/* Mobile Hamburger Menu */}
            <div style={{ display: isMobile ? 'block' : 'none', flex: '0 0 auto' }}>
              <Button 
                type="text" 
                icon={<MenuOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />} 
                onClick={() => setDrawerVisible(true)} 
                style={{ padding: '8px' }}
              />
            </div>

            {/* Logo ve Kurumsal Web Sitesi */}
            {headerLogo && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  gap: isMobile ? '4px' : '2px',
                  flex: isMobile ? '1' : '0 0 auto',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  marginLeft: isMobile ? '0' : '0'
                }}
                onClick={() => navigate('/')}
              >
                <img
                  src={getLogoImageUrl(headerLogo.imageUrl)}
                  alt={headerLogo.altText || headerLogo.name}
                  style={{
                    height: isMobile ? '45px' : `${headerLogo.height || 55}px`,
                    width: isMobile ? 'auto' : `${headerLogo.width || 'auto'}px`,
                    maxWidth: isMobile ? '150px' : '320px',
                    minWidth: isMobile ? '80px' : '120px',
                    objectFit: 'contain'
                  }}
                />
                <div style={{ 
                  display: 'block',
                  textAlign: 'left'
                }}>
                  <div style={{ 
                    fontSize: isMobile ? '16px' : '20px', 
                    fontWeight: 'bold', 
                    color: '#1e3a8a',
                    lineHeight: '1.2'
                  }}>
                    Kurumsal Web Sitesi
                  </div>
                  <div style={{ 
                    fontSize: isMobile ? '10px' : '11px', 
                    color: '#64748b',
                    lineHeight: '1.1',
                    marginTop: '1px',
                    display: isMobile ? 'block' : 'block'
                  }}>
                    {isMobile ? 'Tüm Ortadoğu Sanayici ve İş Adamları Derneği' : 'Tüm Ortadoğu Sanayici ve İş Adamları Derneği'}
                  </div>
                </div>
              </div>
            )}
          
            {/* Desktop Menu */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1, 
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Menu
                mode="horizontal"
                selectedKeys={[]} // Seçili görünümü kaldır
                triggerSubMenuAction="hover"
                items={menuItemsForAntd.map(item => ({
                  ...item,
                  style: { 
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '8px 16px',
                    margin: '0 4px',
                    borderRadius: '8px',
                    color: '#475569',
                    transition: 'all 0.3s ease'
                  }
                }))}
                onClick={handleMenuClick}
                style={{ 
                  border: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: '600',
                  padding: '0 8px',
                  minHeight: 'auto',
                  lineHeight: 'normal'
                }}
              />
            </div>
            

        </div>
      </Header>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#1e3a8a',
            textAlign: 'center',
            padding: '10px 0'
          }}>
            Kurumsal Web Sitesi
          </div>
        }
        placement="right"
        onClose={() => {
          setDrawerVisible(false);
        }}
        open={drawerVisible}
        width={320}
        bodyStyle={{ padding: '0' }}
        headerStyle={{ 
          background: '#f8fafc', 
          borderBottom: '1px solid #e2e8f0',
          padding: '0 20px'
        }}
      >
        <div style={{ padding: '20px 0' }}>
          {(() => {
            // Mobilde hiyerarşik menü yapısı
            const toggleExpanded = (itemId: number) => {
              const newExpanded = new Set(expandedItems);
              if (newExpanded.has(itemId)) {
                newExpanded.delete(itemId);
              } else {
                newExpanded.add(itemId);
              }
              setExpandedItems(newExpanded);
            };

            // Alt öğeleri olan ana öğeleri ve alt öğesi olmayan öğeleri filtrele
            // Alt öğeleri ana menüde gösterme, sadece alt menüde göster
            const childUrls = new Set();
            menuItems.forEach(item => {
              if (item.children) {
                item.children.forEach(child => {
                  childUrls.add(child.url);
                });
              }
            });

            const filteredMenuItems = menuItems.filter(item => {
              // Alt öğesi olmayan öğeleri dahil et
              if (!item.children || item.children.length === 0) {
                return true;
              }
              // Alt öğesi olan ana öğeleri dahil et
              return true;
            }).filter(item => {
              // Alt öğe olarak tanımlanmış öğeleri ana menüden çıkar
              return !childUrls.has(item.url);
            });

            return filteredMenuItems.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.has(item.id);

              return (
                <div key={item.id}>
                  {/* Ana öğe */}
                  <div
                    style={{
                      padding: '12px 20px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#475569',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpanded(item.id);
                      } else {
                        handleMenuClick({ key: item.url });
                        setDrawerVisible(false);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#1e3a8a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }}
                  >
                    <span>{item.title}</span>
                    {hasChildren && (
                      <RightOutlined style={{ 
                        fontSize: '12px', 
                        color: '#64748b',
                        transition: 'transform 0.3s ease', 
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' 
                      }} />
                    )}
                  </div>

                  {/* Alt öğeler */}
                  {hasChildren && isExpanded && (
                    <div style={{ backgroundColor: '#f8fafc' }}>
                      {item.children.map((child) => (
                        <div
                          key={child.id}
                          style={{
                            padding: '10px 20px 10px 40px',
                            fontSize: '14px',
                            fontWeight: '400',
                            color: '#64748b',
                            cursor: 'pointer',
                            borderBottom: '1px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'transparent'
                          }}
                          onClick={() => {
                            handleMenuClick({ key: child.url });
                            setDrawerVisible(false);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e2e8f0';
                            e.currentTarget.style.color = '#1e3a8a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                          }}
                        >
                          {child.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </Drawer>

      <Content style={{ 
        marginTop: isMobile ? 70 : 80,
        background: '#f8fafc',
        minHeight: isMobile ? 'calc(100vh - 70px)' : 'calc(100vh - 80px)'
      }}>
        <Outlet />
      </Content>

      <div>
        <Footer style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          padding: '60px 0 30px 0'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 24px' 
          }}>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                marginBottom: '40px'
              }}
            >
              {/* Logo ve Kurumsal Web Sitesi */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  {footerLogo ? (
                    <img
                      src={getLogoImageUrl(footerLogo.imageUrl)}
                      alt={footerLogo.altText || footerLogo.name}
                      style={{
                        height: `${footerLogo.height || 40}px`,
                        width: `${footerLogo.width || 'auto'}px`,
                        maxWidth: '200px',
                        objectFit: 'contain',
                        marginRight: isMobile ? '6px' : '2px'
                      }}
                    />
                  ) : (
                    <>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: isMobile ? '6px' : '2px'
                      }}>
                        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>T</span>
                      </div>
                    </>
                  )}
                  <div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: 'white',
                      lineHeight: '1.2'
                    }}>
                      {cardSettings.organizationName}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: '1.2',
                      marginTop: '2px'
                    }}>
                      {cardSettings.organizationFullName}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  color: 'white',
                  opacity: 0.9, 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '16px'
                }}>
                  {cardSettings.organizationDescription}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {cardSettings.organizationTags.split(',').map((tag, index) => (
                    <div 
                      key={index}
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.15)', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 500
                      }}
                    >
                      {tag.trim()}
                    </div>
                  ))}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  marginBottom: '16px', 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  İletişim
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {contactInfos.length > 0 ? (
                    contactInfos.map((info) => {
                      const getIcon = () => {
                        const iconStyle = { marginRight: '8px', width: '16px', height: '16px', color: 'white' };
                        switch (info.type) {
                          case 'phone': return <PhoneIcon style={iconStyle} />;
                          case 'email': return <EmailIcon style={iconStyle} />;
                          case 'address': return <LocationIcon style={iconStyle} />;
                          case 'social': return getSocialIcon(info.label);
                          default: return <GlobalOutlined style={{ marginRight: isMobile ? '8px' : '2px', fontSize: '16px' }} />;
                        }
                      };

                      const getSocialIcon = (label: string) => {
                        const lowerLabel = label.toLowerCase();
                        const iconStyle = { marginRight: '8px', width: '16px', height: '16px', color: 'white' };
                        
                        if (lowerLabel.includes('facebook')) {
                          return <FacebookIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('twitter') || lowerLabel.includes('x')) {
                          return <TwitterIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('instagram')) {
                          return <InstagramIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('linkedin')) {
                          return <LinkedinIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('youtube')) {
                          return <YoutubeIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('whatsapp')) {
                          return <WhatsappIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('telegram')) {
                          return <TelegramIcon style={iconStyle} />;
                        }
                        if (lowerLabel.includes('nsosyal')) {
                          return <NSosyalIcon style={iconStyle} />;
                        }
                        
                        // Varsayılan icon
                        return <GlobalOutlined style={{ marginRight: isMobile ? '8px' : '2px', fontSize: '16px' }} />;
                      };

                      const isSocialMedia = info.type === 'social';
                      const isClickable = isSocialMedia && info.url && info.url.startsWith('http');

                      if (isClickable) {
                        return (
                          <a
                            key={info.id}
                            href={info.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: 'white',
                              fontSize: '14px',
                              opacity: 0.9,
                              cursor: 'pointer',
                              textDecoration: 'none',
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                          >
                            {getIcon()} {info.value}
                          </a>
                        );
                      }

                      // Sosyal medya ama URL yok - tıklanabilir değil
                      if (isSocialMedia) {
                        return (
                          <div 
                            key={info.id}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: 'white',
                              fontSize: '14px',
                              opacity: 0.7
                            }}
                          >
                            {getIcon()} {info.value}
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={info.id}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'white',
                            fontSize: '14px',
                            opacity: 0.9,
                            cursor: 'pointer'
                          }}
                        >
                          {getIcon()} {info.label}: {info.value}
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'white',
                          fontSize: '14px',
                          opacity: 0.9,
                          cursor: 'pointer'
                        }}
                      >
                        📍 Admin panelinden adres ekleyebilirsiniz
                      </div>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'white',
                          fontSize: '14px',
                          opacity: 0.9,
                          cursor: 'pointer'
                        }}
                      >
                        📞 Telefon eklemek için İletişim panelini kullanın
                      </div>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'white',
                          fontSize: '14px',
                          opacity: 0.9,
                          cursor: 'pointer'
                        }}
                      >
                        ✉️ E-posta eklemek için İletişim panelini kullanın
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Hızlı Linkler */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  marginBottom: '16px', 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Hızlı Linkler
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {menuItems.filter(item => item.parentId === null).map((item, index) => (
                    <a
                      key={item.id}
                      href={item.url}
                      style={{ 
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '14px',
                        opacity: 0.9,
                        cursor: 'pointer'
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Alt Çizgi */}
            <div 
              style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '20px',
                textAlign: 'center'
              }}
            >
              <p style={{ 
                margin: 0, 
                color: 'white',
                opacity: 0.8, 
                fontSize: '14px' 
              }}>
                © 2025 {SITE_NAME}. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </Footer>
      </div>

      <style>{`
        /* Custom menu styles for professional look */
        .ant-menu-horizontal .ant-menu-item {
            border-radius: 6px;
            margin: 0 4px;
            padding: 6px 12px !important;
            height: auto !important;
            min-height: auto !important;
            max-height: 40px !important;
            line-height: normal !important;
            display: flex !important;
            align-items: center !important;
            vertical-align: middle !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .ant-menu-horizontal .ant-menu-item:hover {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%) !important;
          transform: translateY(-2px);
          color: #1e3a8a !important;
          padding: 6px 12px !important;
          height: auto !important;
          line-height: normal !important;
          display: flex !important;
          align-items: center !important;
          vertical-align: middle !important;
        }

        .ant-menu-horizontal .ant-menu-item-selected {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important;
          color: white !important;
          font-weight: 700;
          padding: 6px 12px !important;
          height: auto !important;
          min-height: auto !important;
          max-height: 40px !important;
          line-height: normal !important;
          display: flex !important;
          align-items: center !important;
          vertical-align: middle !important;
          margin: 0 6px !important;
        }

        .ant-menu-horizontal .ant-menu-item-selected:hover {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%) !important;
          transform: translateY(-2px);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .ant-menu-horizontal {
            display: none !important;
          }
          .ant-layout-header {
            padding: 0 16px !important;
            height: 70px !important;
          }
          .ant-layout-header > div {
            padding: 0 16px !important;
          }
          .ant-layout-content {
            margin-top: 70px !important;
            min-height: calc(100vh - 70px) !important;
          }
        }
        
        @media (max-width: 1024px) {
          .ant-menu-horizontal {
            flex: 0 0 auto !important;
            min-width: auto !important;
          }
          
          .ant-layout-header > div {
            max-width: 100% !important;
            padding: 0 24px !important;
          }
        }

        /* Smooth animations */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </Layout>
  );
};

export default PublicLayout;
