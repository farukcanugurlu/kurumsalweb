import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Upload,
  message,
  Popconfirm,
  Space,
  Card,
  Typography,
  Row,
  Col,
  InputNumber,
  Select,
  Image
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  DragOutlined
} from '@ant-design/icons';
import { HeroSlide } from '../../types';
import { heroSlidesApi, fileUploadApi } from '../../services/api';
import { getSlideImageUrl } from '../../utils/imageUrl';
import { motion } from 'framer-motion';

const { Title } = Typography;
const { TextArea } = Input;

const HeroSlides: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await heroSlidesApi.getAll();
      console.log('API Response:', response);
      if (response.data.success) {
        setSlides(response.data.data.sort((a, b) => a.order - b.order));
      } else {
        console.log('API returned success: false');
        setSlides([]);
      }
    } catch (error) {
      console.error('Fetch slides error:', error);
      message.error('Hero slides yüklenirken hata oluştu: ' + (error as any)?.message);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSlide(null);
    setUploadedImageUrl('');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setUploadedImageUrl(slide.imageUrl);
    form.setFieldsValue(slide);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await heroSlidesApi.delete(id);
      message.success('Slide başarıyla silindi');
      fetchSlides();
    } catch (error) {
      message.error('Slide silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Validate only required fields
      if (!values.order) {
        message.error('Sıra gerekli');
        return;
      }
      if (!uploadedImageUrl && !values.imageUrl) {
        message.error('Görsel gerekli - lütfen bir görsel yükleyin veya URL girin');
        return;
      }

      const submitData = {
        ...values,
        id: editingSlide?.id || 0,
        imageUrl: uploadedImageUrl || values.imageUrl,
        isActive: values.isActive !== undefined ? values.isActive : true,
        // Boş string'leri null'a çevir
        title: values.title || null,
        description: values.description || null
      };
      
      console.log('Submitting data:', submitData);
      
      if (editingSlide) {
        await heroSlidesApi.update(editingSlide.id, submitData);
        message.success('Slide başarıyla güncellendi');
      } else {
        await heroSlidesApi.create(submitData);
        message.success('Slide başarıyla eklendi');
      }
      setModalVisible(false);
      setUploadedImageUrl('');
      fetchSlides();
    } catch (error) {
      console.error('Submit error:', error);
      message.error('Slide kaydedilirken hata oluştu: ' + (error as any)?.message || 'Bilinmeyen hata');
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Gerçek dosya yükleme
      const response = await fileUploadApi.upload(file);
      
      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedImageUrl(imageUrl);
        message.success('Görsel başarıyla yüklendi');
        
        // Clear the URL field since we have an uploaded image
        form.setFieldValue('imageUrl', '');
        form.validateFields(['imageUrl']);
      } else {
        message.error('Görsel yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Görsel yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Sadece resim dosyaları yüklenebilir!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Resim boyutu 2MB\'dan küçük olmalıdır!');
        return false;
      }
      handleImageUpload(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const handleReorder = async (newOrder: number[]) => {
    try {
      const reorderData = newOrder.map((order, index) => ({
        id: slides[index].id,
        order: order
      }));
      await heroSlidesApi.reorder(reorderData);
      message.success('Sıralama güncellendi');
      fetchSlides();
    } catch (error) {
      message.error('Sıralama güncellenirken hata oluştu');
    }
  };

  const columns = [
    {
      title: 'Sıra',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order: number) => (
        <div style={{ textAlign: 'center' }}>
          <DragOutlined style={{ color: '#666' }} />
          <div style={{ fontSize: '12px', marginTop: '4px' }}>{order}</div>
        </div>
      ),
    },
    {
      title: 'Görsel',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (imageUrl: string) => (
        <div style={{ width: 80, height: 45, overflow: 'hidden', borderRadius: '4px' }}>
          <img
            src={getSlideImageUrl(imageUrl)}
            alt="Slide"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ),
    },
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#666' }}>{text}</span>
      ),
    },
    {
      title: 'Buton Metni',
      dataIndex: 'buttonText',
      key: 'buttonText',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_: any, record: HeroSlide) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bu slide'ı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              Hero Slides Yönetimi
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Yeni Slide Ekle
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={slides}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 800 }}
          />
        </Card>
      </motion.div>

      <Modal
        title={editingSlide ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Başlık"
              >
                <Input placeholder="Slide başlığı (isteğe bağlı)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label="Sıra"
                rules={[{ required: true, message: 'Sıra gerekli' }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="Görüntüleme sırası"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <TextArea
              rows={3}
              placeholder="Slide açıklaması (isteğe bağlı)"
            />
          </Form.Item>

          <Form.Item
            label="Görsel"
            required
            validateStatus={(!uploadedImageUrl && !form.getFieldValue('imageUrl')) ? 'error' : ''}
            help={(!uploadedImageUrl && !form.getFieldValue('imageUrl')) ? 'Görsel gerekli' : ''}
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
                JPG, PNG, GIF formatları desteklenir. Maksimum 2MB.
              </div>
            </div>
            
            {uploadedImageUrl && (
              <div style={{ marginTop: 16 }}>
                <Image
                  src={uploadedImageUrl}
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
              rules={[
                {
                  validator: (_, value) => {
                    if (!uploadedImageUrl && !value) {
                      return Promise.reject(new Error('Görsel gerekli - lütfen bir görsel yükleyin veya URL girin'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                placeholder="Veya görsel URL'si girin" 
                addonBefore="URL:"
                onChange={() => form.validateFields(['imageUrl'])}
              />
            </Form.Item>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buttonText"
                label="Buton Metni"
              >
                <Input placeholder="Buton metni (opsiyonel)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="buttonLink"
                label="Buton Linki"
              >
                <Input placeholder="/sayfa-adi veya https://example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="backgroundColor"
                label="Arka Plan Rengi"
              >
                <Input placeholder="#1e3a8a (opsiyonel)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="textColor"
                label="Metin Rengi"
              >
                <Input placeholder="#ffffff (opsiyonel)" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isActive"
            label="Aktif"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                İptal
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSlide ? 'Güncelle' : 'Ekle'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HeroSlides;
