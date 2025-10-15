import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Switch, 
  Select, 
  DatePicker, 
  message,
  Popconfirm,
  Card,
  Typography,
  Image,
  Upload
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { News } from '../../types';
import { newsApi, fileUploadApi } from '../../services/api';
import { getNewsImageUrl } from '../../utils/imageUrl';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Haberler: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsApi.getAll();
      if (response.data.success) {
        setNews(response.data.data);
      }
    } catch (error) {
      message.error('Haberler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    setUploadedImageUrl(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setUploadedImageUrl(null);
    form.resetFields();
  };

  const handleEdit = (record: News) => {
    setEditingNews(record);
    setUploadedImageUrl(record.imageUrl || null);
    form.setFieldsValue({
      ...record,
      publishDate: dayjs(record.publishDate)
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await newsApi.delete(id);
      message.success('Haber silindi');
      fetchNews();
    } catch (error) {
      message.error('Haber silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Frontend doğrulama sonrası payload hazırlama
      const newsData: any = {
        title: values.title?.trim(),
        content: values.content || undefined,
        summary: values.summary?.trim() || undefined,
        category: values.category,
        publishDate: values.publishDate
          ? values.publishDate.format('YYYY-MM-DD')
          : editingNews?.publishDate, // tarih değişmediyse mevcut tarihi koru
        imageUrl: uploadedImageUrl || values.imageUrl || null,
        isActive: values.isActive ?? true
      };

      if (editingNews) {
        newsData.id = editingNews.id; // Body içinde ID bekleniyor (backend kontrol ediyor)
        await newsApi.update(editingNews.id, newsData);
        message.success('Haber güncellendi');
      } else {
        await newsApi.create(newsData);
        message.success('Haber eklendi');
      }

      handleModalClose();
      fetchNews();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'İşlem sırasında hata oluştu';
      message.error(msg);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await fileUploadApi.upload(file);
      
      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedImageUrl(imageUrl);
        message.success('Görsel başarıyla yüklendi');
        
        // Clear the URL field since we have an uploaded image
        form.setFieldValue('imageUrl', '');
      } else {
        message.error('Görsel yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Görsel yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Sadece resim dosyaları yüklenebilir!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return false;
      }
      handleImageUpload(file);
      return false; // Prevent auto upload
    },
  };

  const columns = [
    {
      title: 'Görsel',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (imageUrl: string) => (
      <div style={{ width: 80, height: 45, overflow: 'hidden', borderRadius: '4px' }}>
        {imageUrl ? (
          <img
            src={getNewsImageUrl(imageUrl)}
            alt="Haber görseli"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px'
          }}>
            Görsel Yok
          </div>
        )}
      </div>
      ),
    },
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Yayın Tarihi',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY')
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
      render: (_: any, record: News) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Bu haberi silmek istediğinizden emin misiniz?"
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
          <Title level={3}>Haber Yönetimi</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni Haber Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={news}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
        open={modalVisible}
        onCancel={handleModalClose}
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
            rules={[
              { required: true, message: 'Başlık gerekli' },
              { max: 200, message: 'Başlık en fazla 200 karakter olmalıdır' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="summary"
            label="Özet"
            rules={[
              { required: true, message: 'Özet gerekli' },
              { max: 500, message: 'Özet en fazla 500 karakter olmalıdır' }
            ]}
          >
            <TextArea rows={3} placeholder="Haber özeti" />
          </Form.Item>

          <Form.Item
            name="content"
            label="İçerik"
          >
            <TextArea rows={8} placeholder="(İsteğe bağlı) Haber içeriği" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Kategori"
            rules={[
              { required: true, message: 'Kategori gerekli' },
              { max: 50, message: 'Kategori en fazla 50 karakter olmalıdır' }
            ]}
          >
            <Select 
              placeholder="Kategori seçin"
              allowClear
            >
              <Option value="Genel">Genel</Option>
              <Option value="Etkinlik">Etkinlik</Option>
              <Option value="Duyuru">Duyuru</Option>
              <Option value="Haber">Haber</Option>
              <Option value="Proje">Proje</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="publishDate"
            label="Yayın Tarihi"
            rules={[{ required: true, message: 'Yayın tarihi gerekli' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Görsel"
            validateStatus={(!uploadedImageUrl && !form.getFieldValue('imageUrl')) ? '' : ''}
            help={(!uploadedImageUrl && !form.getFieldValue('imageUrl')) ? 'Opsiyonel' : ''}
          >
            <div style={{ marginBottom: 16 }}>
              <Upload {...uploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                </Button>
              </Upload>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                JPG, PNG, GIF formatları desteklenir. Maksimum 5MB.
              </div>
            </div>
            
            {uploadedImageUrl && (
              <div style={{ marginTop: 16 }}>
                <Image
                  src={getNewsImageUrl(uploadedImageUrl)}
                  alt="Preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9'
                  }}
                />
              </div>
            )}
            
            <Form.Item
              name="imageUrl"
              style={{ marginTop: 16 }}
            >
              <Input 
                placeholder="Veya görsel URL'si girin" 
                addonBefore="URL:"
              />
            </Form.Item>
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
                {editingNews ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button onClick={handleModalClose}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Haberler;
