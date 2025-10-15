import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  message, 
  Popconfirm,
  Space,
  Select,
  Upload,
  Image
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Logo } from '../../types';
import { logoApi, fileUploadApi } from '../../services/api';
import { getLogoImageUrl } from '../../utils/imageUrl';

const { Option } = Select;

const Logolar: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const response = await logoApi.getAll();
      if (response.data.success) {
        setLogos(response.data.data);
      }
    } catch (error) {
      message.error('Logolar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLogo(null);
    form.resetFields();
    setFileList([]);
    setUploadedImageUrl('');
    setModalVisible(true);
  };

  const handleEdit = (logo: Logo) => {
    setEditingLogo(logo);
    form.setFieldsValue({
      name: logo.name,
      altText: logo.altText,
      type: logo.type,
      width: logo.width,
      height: logo.height,
      isActive: logo.isActive,
    });
    setFileList([]);
    setUploadedImageUrl('');
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await logoApi.delete(id);
      if (response.data.success) {
        message.success('Logo başarıyla silindi');
        fetchLogos();
      }
    } catch (error) {
      message.error('Logo silinirken hata oluştu');
    }
  };


  const handleSubmit = async (values: any) => {
    try {
      if (!values.name) {
        message.error('Logo adı gerekli');
        return;
      }
      if (!values.type) {
        message.error('Logo tipi gerekli');
        return;
      }
      if (!uploadedImageUrl && !editingLogo) {
        message.error('Logo dosyası gerekli - lütfen bir logo yükleyin');
        return;
      }

      const submitData = {
        ...values,
        imageUrl: uploadedImageUrl || editingLogo?.imageUrl,
        isActive: values.isActive !== undefined ? values.isActive : true
      };
      
      console.log('Submitting data:', submitData);
      
      if (editingLogo) {
        await logoApi.update(editingLogo.id, submitData);
        message.success('Logo başarıyla güncellendi');
      } else {
        await logoApi.create(submitData);
        message.success('Logo başarıyla eklendi');
      }
      setModalVisible(false);
      fetchLogos();
    } catch (error) {
      message.error(editingLogo ? 'Logo güncellenirken hata oluştu' : 'Logo oluşturulurken hata oluştu');
    }
  };

  const columns = [
    {
      title: 'Logo',
      key: 'image',
      width: 100,
      render: (_: any, record: Logo) => (
        <Image
          src={getLogoImageUrl(record.imageUrl)}
          alt={record.altText || record.name}
          width={60}
          height={40}
          style={{ objectFit: 'contain' }}
        />
      ),
    },
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeLabels: { [key: string]: string } = {
          header: 'Header',
          footer: 'Footer',
          favicon: 'Favicon'
        };
        return typeLabels[type] || type;
      },
    },
    {
      title: 'Boyut',
      key: 'size',
      render: (_: any, record: Logo) => `${record.width}x${record.height}`,
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? 'Evet' : 'Hayır'}
        </span>
      ),
    },
    {
      title: 'Oluşturulma',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_: any, record: Logo) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu logoyu silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await fileUploadApi.upload(file);
      
      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedImageUrl(imageUrl);
        message.success('Logo başarıyla yüklendi');
        
        // Clear the file list since we have an uploaded image
        setFileList([]);
      } else {
        message.error('Logo yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Logo yüklenirken hata oluştu');
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
      handleUpload(file);
      return false; // Prevent auto upload
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1)); // Keep only the last file
    },
    fileList,
  };

  return (
    <div>
      <Card
        title="Logo Yönetimi"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni Logo Ekle
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={logos}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} logo`,
          }}
        />
      </Card>

      <Modal
        title={editingLogo ? 'Logoyu Düzenle' : 'Yeni Logo Ekle'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'header',
            width: 150,
            height: 50,
            isActive: true,
          }}
        >
          <Form.Item
            name="name"
            label="Logo Adı"
            rules={[{ required: true, message: 'Logo adı gereklidir' }]}
          >
            <Input placeholder="Logo adını girin" />
          </Form.Item>

          <Form.Item
            name="altText"
            label="Alt Metin"
          >
            <Input placeholder="Alt metin girin (opsiyonel)" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Logo Tipi"
            rules={[{ required: true, message: 'Logo tipi gereklidir' }]}
          >
            <Select placeholder="Logo tipini seçin">
              <Option value="header">Header</Option>
              <Option value="footer">Footer</Option>
              <Option value="favicon">Favicon</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="width"
            label="Genişlik (px)"
            rules={[{ required: true, message: 'Genişlik gereklidir' }]}
          >
            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="height"
            label="Yükseklik (px)"
            rules={[{ required: true, message: 'Yükseklik gereklidir' }]}
          >
            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Aktif"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Logo Dosyası"
            required={!editingLogo}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                {editingLogo ? 'Yeni Logo Yükle (Opsiyonel)' : 'Logo Yükle'}
              </Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Desteklenen formatlar: JPG, PNG, GIF, SVG. Maksimum dosya boyutu: 5MB
            </div>
            {uploadedImageUrl && (
              <div style={{ marginTop: 8 }}>
                <Image
                  src={uploadedImageUrl}
                  alt="Yüklenen logo"
                  width={100}
                  height={60}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </Form.Item>

          {editingLogo && (
            <Form.Item label="Mevcut Logo">
              <Image
                src={editingLogo.imageUrl}
                alt={editingLogo.altText || editingLogo.name}
                width={editingLogo.width}
                height={editingLogo.height}
                style={{ objectFit: 'contain' }}
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                İptal
              </Button>
              <Button type="primary" htmlType="submit">
                {editingLogo ? 'Güncelle' : 'Oluştur'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Logolar;
