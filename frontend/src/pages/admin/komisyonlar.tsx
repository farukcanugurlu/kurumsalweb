import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber,
  message,
  Popconfirm,
  Card,
  Typography,
  Upload,
  Image,
  Switch
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Commission } from '../../types';
import { commissionApi, fileUploadApi } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

const Komisyonlar: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const response = await commissionApi.getAllForAdmin();
      if (response.data.success) {
        setCommissions(response.data.data);
      }
    } catch (error) {
      message.error('Komisyonlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCommission(null);
    form.resetFields();
    setFileList([]);
    setUploadedImageUrl('');
    setModalVisible(true);
  };

  const handleEdit = (record: Commission) => {
    setEditingCommission(record);
    form.setFieldsValue(record);
    setFileList([]);
    setUploadedImageUrl('');
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await commissionApi.delete(id);
      message.success('Komisyon silindi');
      fetchCommissions();
    } catch (error) {
      message.error('Komisyon silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const commissionData = {
        ...values,
        imageUrl: uploadedImageUrl || values.imageUrl,
        isActive: values.isActive !== undefined ? values.isActive : true
      };

      if (editingCommission) {
        commissionData.id = editingCommission.id;
        await commissionApi.update(editingCommission.id, commissionData);
        message.success('Komisyon güncellendi');
      } else {
        await commissionApi.create(commissionData);
        message.success('Komisyon eklendi');
      }

      setModalVisible(false);
      fetchCommissions();
    } catch (error) {
      message.error('İşlem sırasında hata oluştu');
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await fileUploadApi.upload(file);
      
      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setUploadedImageUrl(imageUrl);
        message.success('Fotoğraf başarıyla yüklendi');
        
        // Clear the URL field since we have an uploaded image
        form.setFieldValue('imageUrl', '');
      } else {
        message.error('Fotoğraf yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Fotoğraf yüklenirken hata oluştu');
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
        message.error('Resim boyutu 5MB\'dan küçük olmalıdır!');
        return false;
      }
      handleImageUpload(file);
      return false; // Prevent auto upload
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1)); // Keep only the last file
    },
    fileList,
  };

  const columns = [
    {
      title: 'Komisyon Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Başkan',
      dataIndex: 'chairman',
      key: 'chairman',
    },
    {
      title: 'Başkan Yardımcısı',
      dataIndex: 'viceChairman',
      key: 'viceChairman',
    },
    {
      title: 'Sıra',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? 'Aktif' : 'Pasif'}
        </span>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Commission) => (
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
            title="Bu komisyonu silmek istediğinizden emin misiniz?"
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
          <div>
            <Title level={3} style={{ margin: 0 }}>Komisyon Yönetimi</Title>
            <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
              Toplam: {commissions.length} komisyon | 
              Aktif: {commissions.filter(c => c.isActive).length} | 
              Pasif: {commissions.filter(c => !c.isActive).length}
            </div>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni Komisyon Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={commissions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCommission ? 'Komisyon Düzenle' : 'Yeni Komisyon Ekle'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Komisyon Adı"
            rules={[{ required: true, message: 'Komisyon adı gerekli' }]}
          >
            <Input placeholder="Örn: Terörle Mücadele Komisyonu" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <TextArea rows={4} placeholder="Komisyonun görevleri ve faaliyetleri hakkında açıklama (isteğe bağlı)" />
          </Form.Item>

          <Form.Item
            name="chairman"
            label="Başkan"
            rules={[{ required: true, message: 'Başkan adı gerekli' }]}
          >
            <Input placeholder="Komisyon başkanının adı" />
          </Form.Item>

          <Form.Item
            name="viceChairman"
            label="Başkan Yardımcısı"
            rules={[{ required: true, message: 'Başkan yardımcısı adı gerekli' }]}
          >
            <Input placeholder="Komisyon başkan yardımcısının adı" />
          </Form.Item>

          <Form.Item
            name="members"
            label="Üyeler"
          >
            <TextArea 
              rows={3} 
              placeholder="Komisyon üyelerinin adlarını virgülle ayırarak yazın&#10;Örn: Ahmet Yılmaz, Mehmet Kaya, Ayşe Demir"
            />
          </Form.Item>

          <Form.Item
            label="Komisyon Fotoğrafı"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                {editingCommission ? 'Yeni Fotoğraf Yükle (Opsiyonel)' : 'Fotoğraf Yükle'}
              </Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Desteklenen formatlar: JPG, PNG, GIF. Maksimum dosya boyutu: 5MB
            </div>
            {uploadedImageUrl && (
              <div style={{ marginTop: 8 }}>
                <Image
                  src={uploadedImageUrl}
                  alt="Yüklenen fotoğraf"
                  width={150}
                  height={150}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Fotoğraf URL (Alternatif)"
          >
            <Input placeholder="Ya da dosya URL'si girerek fotoğraf ekleyebilirsiniz" />
          </Form.Item>

          {editingCommission && (
            <Form.Item label="Mevcut Fotoğraf">
              {editingCommission.imageUrl && (
                <Image
                  src={editingCommission.imageUrl}
                  alt={editingCommission.name}
                  width={150}
                  height={150}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </Form.Item>
          )}

          <Form.Item
            name="order"
            label="Sıra"
            rules={[{ required: true, message: 'Sıra gerekli' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Durum"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCommission ? 'Güncelle' : 'Kaydet'}
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

export default Komisyonlar;
