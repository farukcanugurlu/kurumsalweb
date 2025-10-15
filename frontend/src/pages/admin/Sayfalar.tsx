import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Switch, 
  InputNumber,
  message,
  Popconfirm,
  Card,
  Typography,
  Select,
  Upload,
  Image
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MenuOutlined, UploadOutlined } from '@ant-design/icons';
import { Page, PageTemplate } from '../../types';
import { pagesApi, menuApi, fileUploadApi } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

// Şablon seçenekleri
const templateOptions = [
  { value: PageTemplate.Default, label: 'Varsayılan', description: 'Basit metin sayfası' },
  { value: PageTemplate.Information, label: 'Bilgi', description: 'Bilgilendirici içerik' },
  { value: PageTemplate.Blog, label: 'Blog', description: 'Blog yazısı formatı' },
  { value: PageTemplate.Gallery, label: 'Galeri', description: 'Resim galerisi' },
  { value: PageTemplate.Services, label: 'Hizmetler', description: 'Hizmet listesi' },
  { value: PageTemplate.About, label: 'Hakkında', description: 'Kurumsal bilgi' },
  { value: PageTemplate.PresidentsMessage, label: 'Başkanın Mesajı', description: 'Başkanın fotoğrafı ve mesajı' },
  { value: PageTemplate.Credits, label: 'Künyeli Bilgi', description: 'Künye ve kurumsal bilgiler' },
  { value: PageTemplate.VisionMissionValues, label: 'VizyonMisyonDegerler', description: 'Vizyon, Misyon ve Değerler sayfası' },
  { value: PageTemplate.Render, label: 'Render Sayfa', description: 'Komisyonlar ve sektör kurulları dinamik gösterimi' }
];

const Sayfalar: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        setPages(response.data.data);
        console.log('Fetched pages:', response.data.data);
      }
    } catch (error) {
      message.error('Sayfalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPage(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Page) => {
    setEditingPage(record);
    // Form değerlerini doğru şekilde yükle
    form.setFieldsValue({
      title: record.title,
      slug: record.slug,
      content: record.content,
      order: record.order,
      isActive: record.isActive,
      parentId: record.parentId,
      template: record.template || PageTemplate.Default,
      imageUrl: record.imageUrl
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await pagesApi.delete(id);
      message.success('Sayfa silindi');
      fetchPages();
    } catch (error) {
      message.error('Sayfa silinirken hata oluştu');
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await fileUploadApi.upload(file);
      if (response.data.success) {
        message.success('Görsel yüklendi');
        return response.data.data.url;
      } else {
        message.error('Görsel yüklenirken hata oluştu');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Görsel yüklenirken hata oluştu');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Form values:', values);
      console.log('Editing page:', editingPage);
      
      if (editingPage) {
        console.log('Updating page with ID:', editingPage.id);
        console.log('Old slug:', editingPage.slug);
        console.log('New slug:', values.slug);
        
        const response = await pagesApi.update(editingPage.id, values);
        console.log('Update response:', response);
        
        if (response.data.success) {
          console.log('Updated page data:', response.data.data);
          message.success('Sayfa güncellendi');
        } else {
          message.error('Güncelleme başarısız');
        }
      } else {
        const response = await pagesApi.create(values);
        console.log('Create response:', response);
        message.success('Sayfa eklendi');
      }

      setModalVisible(false);
      fetchPages();
    } catch (error) {
      console.error('Submit error:', error);
      message.error('İşlem sırasında hata oluştu');
    }
  };

  const handleAddToMenu = async (pageId: number, pageTitle: string) => {
    try {
      await menuApi.syncPage(pageId);
      message.success(`${pageTitle} menüye eklendi`);
    } catch (error: any) {
      if (error.response?.status === 400) {
        message.warning(error.response.data.message || 'Bu sayfa zaten menüde mevcut');
      } else {
        message.error('Menüye eklenirken hata oluştu');
      }
    }
  };

  const columns = [
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => `/${slug}`
    },
    {
      title: 'Şablon',
      dataIndex: 'template',
      key: 'template',
      render: (template: PageTemplate) => {
        const templateOption = templateOptions.find(opt => opt.value === template);
        return templateOption ? templateOption.label : 'Varsayılan';
      }
    },
    {
      title: 'Sıra',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => isActive ? 'Evet' : 'Hayır'
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Page) => (
        <Space wrap>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Düzenle
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<MenuOutlined />}
            onClick={() => handleAddToMenu(record.id, record.title)}
          >
            Menüye Ekle
          </Button>
          <Popconfirm
            title="Bu sayfayı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3}>Sayfa Yönetimi</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni Sayfa Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={pages}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa Ekle'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Başlık"
            rules={[{ required: true, message: 'Başlık gerekli' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="slug"
            label="URL (örn: hakkimizda)"
            rules={[{ required: true, message: 'URL gerekli' }]}
            help="⚠️ URL'lerde Türkçe karakter (ç, ğ, ı, ö, ş, ü) kullanmayın. Sadece İngilizce harfler, rakamlar ve tire (-) kullanın."
          >
            <Input placeholder="hakkimizda" />
          </Form.Item>

          <Form.Item
            name="template"
            label="Sayfa Şablonu"
            rules={[{ required: true, message: 'Şablon seçimi gerekli' }]}
            initialValue={PageTemplate.Default}
          >
            <Select
              placeholder="Şablon seçin"
              options={templateOptions.map(option => ({
                value: option.value,
                label: (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{option.description}</div>
                  </div>
                )
              }))}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="İçerik"
          >
            <TextArea rows={10} placeholder="Sayfa içeriği (isteğe bağlı)" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Görsel"
            help="Sayfa için görsel yükleyin veya URL girin (opsiyonel)"
          >
            <div>
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={async (file) => {
                  const url = await handleImageUpload(file);
                  if (url) {
                    form.setFieldsValue({ imageUrl: url });
                  }
                  return false; // Prevent default upload
                }}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Yükle</div>
                </div>
              </Upload>
              
              {form.getFieldValue('imageUrl') && (
                <div style={{ marginTop: 16 }}>
                  <Image
                    src={form.getFieldValue('imageUrl')}
                    alt="Preview"
                    style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={() => form.setFieldsValue({ imageUrl: '' })}
                    >
                      Görseli Kaldır
                    </Button>
                  </div>
                </div>
              )}
              
              <Input 
                placeholder="Veya görsel URL'i girin"
                style={{ marginTop: 8 }}
                onChange={(e) => form.setFieldsValue({ imageUrl: e.target.value })}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="order"
            label="Sıra"
            rules={[{ required: true, message: 'Sıra gerekli' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Aktif"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPage ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sayfalar;
