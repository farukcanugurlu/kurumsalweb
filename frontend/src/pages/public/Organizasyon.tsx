import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Tabs,
  Tag,
  Divider
} from 'antd';
import { 
  BankOutlined,
  SoundOutlined,
  ExperimentOutlined,
  HeartOutlined,
  DollarOutlined,
  BuildOutlined,
  BulbOutlined,
  GlobalOutlined,
  RocketOutlined,
  BookOutlined,
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
  TeamOutlined,
  ToolOutlined,
  HomeOutlined,
  CloudOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  PictureOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Page, Commission } from '../../types';
import { pagesApi, commissionApi } from '../../services/api';

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
    return <WomanOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />;
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
    return <ToolOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
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

const { Title, Paragraph } = Typography;

const Organizasyon: React.FC = () => {
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [sectorBoards, setSectorBoards] = useState<Commission[]>([]);

  useEffect(() => {
    fetchPageContent();
    fetchCommissions();
    fetchSectorBoards();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        // Komisyonlar ve Sektör Kurulları sayfasını bul
        const komisyonlarPage = response.data.data.find(
          (page: Page) => page.slug === 'komisyonlarvesektorkurullari' || 
          page.title.toLowerCase().includes('komisyonlar') ||
          page.title.toLowerCase().includes('sektör')
        );
        setPageContent(komisyonlarPage || null);
      }
    } catch (error) {
      console.error('Sayfa içeriği yüklenirken hata:', error);
    }
  };

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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
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
          {pageContent?.title || 'Komisyonlar ve Sektör Kurulları'}
        </Title>
        {pageContent?.content && (
        <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
            <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
          </Paragraph>
          )}
      </div>

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


    </div>
  );
};

export default Organizasyon;