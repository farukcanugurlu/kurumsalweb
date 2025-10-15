import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Space, 
  message,
  Divider,
  Tag,
  Select,
  Image,
  Upload
} from 'antd';
import { SaveOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { siteSettingsApi, logoApi, fileUploadApi } from '../../services/api';
import { Logo } from '../../types';
import { getLogoImageUrl } from '../../utils/imageUrl';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CardSettings {
  organizationName: string;
  organizationFullName: string;
  organizationDescription: string;
  organizationTags: string;
  cardLogoUrl?: string;
}

const KartYonetimi: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<CardSettings>({
    organizationName: 'Kurumsal Web Sitesi',
    organizationFullName: 'Tüm Ortadoğu Sanayici ve İş Adamları Derneği',
    organizationDescription: 'Ortadoğu bölgesinde ticari ve sanayi işbirliğini geliştirmek için kurulmuş derneğimiz, bölge ülkeleri arasında güçlü ticari bağlar kurarak ekonomik kalkınmaya katkıda bulunmaktadır. İş dünyasının önde gelen isimlerini bir araya getirerek, sürdürülebilir ticari ilişkiler ve karşılıklı fayda sağlayan işbirlikleri oluşturuyoruz.',
    organizationTags: '🌍 Ortadoğu İşbirliği,🤝 Ticari Ağ,📈 Ekonomik Kalkınma'
  });

  useEffect(() => {
    fetchCardSettings();
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await logoApi.getAll();
      if (response.data.success) {
        setLogos(response.data.data);
      }
    } catch (error) {
      console.error('Logolar yüklenirken hata:', error);
    }
  };

  const fetchCardSettings = async () => {
    try {
      const [nameResponse, fullNameResponse, descriptionResponse, tagsResponse, logoResponse] = await Promise.all([
        siteSettingsApi.getByKey('card_organization_name'),
        siteSettingsApi.getByKey('card_organization_full_name'),
        siteSettingsApi.getByKey('card_organization_description'),
        siteSettingsApi.getByKey('card_organization_tags'),
        siteSettingsApi.getByKey('card_logo_url')
      ]);

      const settings: CardSettings = {
        organizationName: nameResponse.data.success ? nameResponse.data.data?.value || previewData.organizationName : previewData.organizationName,
        organizationFullName: fullNameResponse.data.success ? fullNameResponse.data.data?.value || previewData.organizationFullName : previewData.organizationFullName,
        organizationDescription: descriptionResponse.data.success ? descriptionResponse.data.data?.value || previewData.organizationDescription : previewData.organizationDescription,
        organizationTags: tagsResponse.data.success ? tagsResponse.data.data?.value || previewData.organizationTags : previewData.organizationTags,
        cardLogoUrl: logoResponse.data.success ? logoResponse.data.data?.value || '' : ''
      };

      setPreviewData(settings);
      form.setFieldsValue(settings);
    } catch (error) {
      console.error('Kart ayarları yüklenirken hata:', error);
    }
  };

  const handleSave = async (values: CardSettings) => {
    setLoading(true);
    try {
      await Promise.all([
        siteSettingsApi.createOrUpdate({
          key: 'card_organization_name',
          value: values.organizationName,
          description: 'Kartlarda görünecek organizasyon adı'
        }),
        siteSettingsApi.createOrUpdate({
          key: 'card_organization_full_name',
          value: values.organizationFullName,
          description: 'Kartlarda görünecek organizasyon tam adı'
        }),
        siteSettingsApi.createOrUpdate({
          key: 'card_organization_description',
          value: values.organizationDescription,
          description: 'Kartlarda görünecek organizasyon açıklaması'
        }),
        siteSettingsApi.createOrUpdate({
          key: 'card_organization_tags',
          value: values.organizationTags,
          description: 'Kartlarda görünecek etiketler (virgülle ayrılmış)'
        }),
        siteSettingsApi.createOrUpdate({
          key: 'card_logo_url',
          value: values.cardLogoUrl || '',
          description: 'Kartlarda görünecek logo URL\'si'
        })
      ]);

      setPreviewData(values);
      message.success('Kart ayarları başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kart ayarları kaydedilirken hata:', error);
      message.error('Kart ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await fileUploadApi.upload(file);
      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedImageUrl(imageUrl);
        form.setFieldValue('cardLogoUrl', imageUrl);
        message.success('Logo başarıyla yüklendi!');
      }
    } catch (error) {
      message.error('Logo yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleLogoSelect = (logoId: number) => {
    const selectedLogo = logos.find(logo => logo.id === logoId);
    if (selectedLogo) {
      const logoUrl = getLogoImageUrl(selectedLogo.imageUrl);
      form.setFieldValue('cardLogoUrl', logoUrl);
      setUploadedImageUrl(logoUrl);
    }
  };

  const renderPreview = () => {
    const tags = previewData.organizationTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    return (
      <Card 
        style={{ 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={16}>
            <Title 
              level={2} 
              style={{ 
                color: 'white', 
                marginBottom: 16,
                fontSize: '28px',
                fontWeight: 700
              }}
            >
              {previewData.organizationName}
            </Title>
            <Title 
              level={4} 
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: 20,
                fontSize: '18px',
                fontWeight: 500
              }}
            >
              {previewData.organizationFullName}
            </Title>
            <Text
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: 20,
                display: 'block'
              }}
            >
              {previewData.organizationDescription}
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
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              {previewData.cardLogoUrl ? (
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Image
                    src={previewData.cardLogoUrl}
                    alt="Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    preview={false}
                  />
                </div>
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
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
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    {previewData.organizationName}
                  </span>
                </div>
              )}
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '12px',
                fontWeight: 500
              }}>
                {previewData.organizationFullName}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Kart Yönetimi</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
        Ana sayfa ve diğer sayfalarda görünen organizasyon kartlarının içeriğini yönetin.
      </Text>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Kart Ayarları" extra={<Tag color="blue">Düzenle</Tag>}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={previewData}
            >
              <Form.Item
                name="organizationName"
                label="Organizasyon Adı"
                rules={[{ required: true, message: 'Organizasyon adı gerekli' }]}
              >
                <Input placeholder="Örn: Kurumsal Web Sitesi" />
              </Form.Item>

              <Form.Item
                name="organizationFullName"
                label="Organizasyon Tam Adı"
                rules={[{ required: true, message: 'Organizasyon tam adı gerekli' }]}
              >
                <Input placeholder="Örn: Tüm Ortadoğu Sanayici ve İş Adamları Derneği" />
              </Form.Item>

              <Form.Item
                name="organizationDescription"
                label="Açıklama"
                rules={[{ required: true, message: 'Açıklama gerekli' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Organizasyon hakkında detaylı açıklama..."
                />
              </Form.Item>

              <Form.Item
                name="organizationTags"
                label="Etiketler"
                extra="Virgülle ayırarak etiketleri girin. Örn: 🌍 Ortadoğu İşbirliği,🤝 Ticari Ağ,📈 Ekonomik Kalkınma"
              >
                <TextArea 
                  rows={2} 
                  placeholder="🌍 Ortadoğu İşbirliği,🤝 Ticari Ağ,📈 Ekonomik Kalkınma"
                />
              </Form.Item>

              <Form.Item
                name="cardLogoUrl"
                label="Kart Logosu"
                extra="Kartlarda görünecek logo seçin veya yeni logo yükleyin"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Mevcut logolardan seçme */}
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                      Mevcut logolardan seç:
                    </Text>
                    <Select
                      placeholder="Logo seçin..."
                      style={{ width: '100%' }}
                      onChange={handleLogoSelect}
                      allowClear
                    >
                      {logos.map(logo => (
                        <Select.Option key={logo.id} value={logo.id}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Image
                              src={getLogoImageUrl(logo.imageUrl)}
                              alt={logo.altText || logo.name}
                              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                              preview={false}
                            />
                            <span>{logo.name} ({logo.type})</span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  {/* Yeni logo yükleme */}
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                      Yeni logo yükle:
                    </Text>
                    <Upload
                      beforeUpload={handleLogoUpload}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button 
                        icon={<UploadOutlined />} 
                        loading={uploading}
                        style={{ width: '100%' }}
                      >
                        {uploading ? 'Yükleniyor...' : 'Logo Yükle'}
                      </Button>
                    </Upload>
                  </div>

                  {/* Seçilen logo önizlemesi */}
                  {uploadedImageUrl && (
                    <div style={{ marginTop: '8px' }}>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        Seçilen Logo:
                      </Text>
                      <Image
                        src={uploadedImageUrl}
                        alt="Seçilen logo"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'contain',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px'
                        }}
                        preview={false}
                      />
                    </div>
                  )}
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  block
                >
                  Ayarları Kaydet
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="Önizleme" 
            extra={<Tag color="green"><EyeOutlined /> Canlı Görünüm</Tag>}
          >
            {renderPreview()}
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="Bilgilendirme">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Title level={4}>Kartların Görüneceği Yerler:</Title>
            <ul>
              <li>Ana sayfa</li>
              <li>Hakkımızda sayfası</li>
              <li>İletişim sayfası</li>
              <li>Diğer sayfa içeriklerinde</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>Önemli Notlar:</Title>
            <ul>
              <li>Değişiklikler tüm sayfalarda anında yansır</li>
              <li>Logo otomatik olarak header logodan alınır</li>
              <li>Etiketlerde emoji kullanabilirsiniz</li>
              <li>Boş bırakılan alanlar varsayılan değerlerle doldurulur</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default KartYonetimi;
