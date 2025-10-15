import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Select,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons';
import { OrganizationMember } from '../../types';
import { organizationApi, fileUploadApi } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

const Organizasyon: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [schemeVisible, setSchemeVisible] = useState(false);
  const [schemeForm] = Form.useForm();
  const [schemeData, setSchemeData] = useState<any>(null);
  const [schemeFileList, setSchemeFileList] = useState<any[]>([]);
  const [schemeUploadedImageUrl, setSchemeUploadedImageUrl] = useState<string>('');
  const [schemeUploading, setSchemeUploading] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchSchemeData();
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await organizationApi.getMembers();
      if (response.data.success) {
        console.log('Members data:', response.data.data);
        setMembers(response.data.data);
      }
    } catch (error) {
      message.error('Üyeler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAdd = () => {
    setEditingMember(null);
    form.resetFields();
    setFileList([]);
    setUploadedImageUrl('');
    setModalVisible(true);
  };

  const handleEdit = (record: OrganizationMember) => {
    setEditingMember(record);
    form.setFieldsValue(record);
    setFileList([]);
    setUploadedImageUrl('');
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await organizationApi.deleteMember(id);
      message.success('Üye silindi');
      fetchMembers();
    } catch (error) {
      message.error('Üye silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const memberData = {
        ...values,
        imageUrl: uploadedImageUrl || values.imageUrl
      };

      if (editingMember) {
        // Edit işleminde ID'yi dahil et
        memberData.id = editingMember.id;
        console.log('Updating member with data:', memberData);
        await organizationApi.updateMember(editingMember.id, memberData);
        message.success('Üye güncellendi');
      } else {
        await organizationApi.createMember(memberData);
        message.success('Üye eklendi');
      }

      setModalVisible(false);
      fetchMembers();
    } catch (error) {
      message.error('İşlem sırasında hata oluştu');
    }
  };

  const fetchSchemeData = useCallback(async () => {
    try {
      console.log('Fetching scheme data...');
      const response = await organizationApi.getScheme();
      console.log('Scheme API response:', response.data);
      if (response.data.success) {
        setSchemeData(response.data.data);
        schemeForm.setFieldsValue({
          schemeUrlMan: response.data.data.schemeUrl,
          description: response.data.data.description
        });
      }
    } catch (error) {
      console.error('Şema verileri yüklenirken hata:', error);
    }
  }, [schemeForm]);

  const handleSchemeSubmit = async (values: any) => {
    try {
      console.log('Current schemeUploadedImageUrl:', schemeUploadedImageUrl);
      console.log('Form values.schemeUrlMan:', values.schemeUrlMan);
      console.log('Current schemeData?.schemeUrl:', schemeData?.schemeUrl);
      
      const submitData = {
        schemeUrl: schemeUploadedImageUrl || values.schemeUrlMan || schemeData?.schemeUrl,
        description: values.description
      };
      console.log('Submitting scheme data:', submitData);
      const response = await organizationApi.setScheme(submitData);
      console.log('Scheme submit response:', response.data);
      message.success('Organizasyon şeması güncellendi');
      setSchemeVisible(false);
      fetchSchemeData();
    } catch (error) {
      console.error('Scheme submit error:', error);
      message.error('Şema güncellenirken hata oluştu');
    }
  };

  const handleSchemeSettings = () => {
    setSchemeVisible(true);
    setSchemeFileList([]);
    setSchemeUploadedImageUrl('');
    // Reset form da diyelim
    schemeForm.resetFields();
  };

  const handleSchemeImageUpload = async (file: File) => {
    setSchemeUploading(true);
    try {
      console.log('Scheme upload file:', { 
        name: file.name, 
        type: file.type, 
        size: file.size 
      });
      const response = await fileUploadApi.upload(file);
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        const imageUrl = response.data.data.url;
        console.log('Setting schemeUploadedImageUrl:', imageUrl);
        setSchemeUploadedImageUrl(imageUrl);
        message.success('Şema görseli başarıyla yüklendi');
      } else {
        console.error('Upload failed:', response.data);
        message.error('Şema görseli yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Scheme upload error:', error);
      message.error('Şema görseli yüklenirken hata oluştu');
    } finally {
      setSchemeUploading(false);
    }
    return false; // Prevent default upload
  };

  const schemeUploadProps = {
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (!isImage && !isPDF) {
        message.error('Sadece resim dosyaları (JPG, PNG, GIF) ve PDF dosyaları yüklenebilir!');
        return false;
      }
      
      const isLt5M = file.size / 1024 / 1024 < 5; // 5MB limiti
      if (!isLt5M) {
        message.error('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return false;
      }
      
      handleSchemeImageUpload(file);
      return false; // Prevent auto upload
    },
    onChange: (info: any) => {
      setSchemeFileList(info.fileList.slice(-1)); // Keep only the last file
    },
    fileList: schemeFileList,
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

  const columns = useMemo(() => [
    {
      title: 'Ad Soyad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        console.log('Category value:', category, 'Type:', typeof category);
        const categoryText = {
          'founder': 'Kurucu Üye',
          'board': 'Yönetim Kurulu',
          'member': 'Üye',
          'secretary': 'Sekreter',
          'treasurer': 'Sayman',
          'commission': 'Komisyon',
          'sector_board': 'Sektör Kurulu',
          'honorary': 'Onursal Üye',
          'other': 'Diğer'
        };
        const categoryColor = {
          'founder': 'gold',
          'board': 'red',
          'member': 'blue',
          'secretary': 'purple',
          'treasurer': 'green',
          'commission': 'cyan',
          'sector_board': 'orange',
          'honorary': 'magenta',
          'other': 'default'
        };
        return (
          <Tag color={categoryColor[category as keyof typeof categoryColor] || 'default'}>
            {categoryText[category as keyof typeof categoryText] || category}
          </Tag>
        );
      }
    },
    {
      title: 'Pozisyon',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Departman',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Sıra',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: OrganizationMember) => (
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
            title="Bu üyeyi silmek istediğinizden emin misiniz?"
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
  ], []);

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Organizasyon Yönetimi</Title>
            <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
              {useMemo(() => {
                const stats = {
                  total: members.length,
                  founder: members.filter(m => m.category === 'founder').length,
                  board: members.filter(m => m.category === 'board').length,
                  member: members.filter(m => m.category === 'member').length,
                  secretary: members.filter(m => m.category === 'secretary').length,
                  treasurer: members.filter(m => m.category === 'treasurer').length,
                  commission: members.filter(m => m.category === 'commission').length,
                  sector_board: members.filter(m => m.category === 'sector_board').length,
                  honorary: members.filter(m => m.category === 'honorary').length,
                  other: members.filter(m => m.category === 'other').length
                };
                return `Toplam: ${stats.total} üye | Kurucu: ${stats.founder} | Yönetim: ${stats.board} | Üye: ${stats.member} | Sekreter: ${stats.secretary} | Sayman: ${stats.treasurer} | Komisyon: ${stats.commission} | Sektör Kurulu: ${stats.sector_board} | Onursal: ${stats.honorary} | Diğer: ${stats.other}`;
              }, [members])}
            </div>
          </div>
          <Space>
            <Button 
              onClick={() => {
                Modal.confirm({
                  title: 'Şemayı Sil',
                  content: 'Mevcut organizasyon şemasını silmek istediğinizden emin misiniz?',
                  okText: 'Evet, Sil',
                  cancelText: 'İptal',
                  onOk: () => {
                    return organizationApi.setScheme({ schemeUrl: '', description: '' }).then(() => {
                      message.success('Şema silindi');
                      fetchSchemeData();
                    }).catch(err => {
                      message.error('Şema silinirken hata oluştu');
                      throw err;
                    });
                  }
                });
              }}
              danger
              icon={<DeleteOutlined />}
            >
              Şemayı Sil
            </Button>
            <Button 
              icon={<SettingOutlined />}
              onClick={handleSchemeSettings}
            >
              Şema Ayarları
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Yeni Üye Ekle
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={members}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}
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
            label="Ad Soyad"
            rules={[{ required: true, message: 'Ad soyad gerekli' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="position"
            label="Pozisyon"
            rules={[{ required: true, message: 'Pozisyon gerekli' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="Departman"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Biyografi"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Fotoğraf"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={uploading}>
                {editingMember ? 'Yeni Fotoğraf Yükle (Opsiyonel)' : 'Fotoğraf Yükle'}
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

          {editingMember && (
            <Form.Item label="Mevcut Fotoğraf">
              {editingMember.imageUrl && (
                <Image
                  src={editingMember.imageUrl}
                  alt={editingMember.name}
                  width={150}
                  height={150}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </Form.Item>
          )}

          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori gerekli' }]}
            initialValue="other"
          >
            <Select placeholder="Üye kategorisini seçin">
              <Select.Option value="founder">Kurucu Üye</Select.Option>
              <Select.Option value="board">Yönetim Kurulu</Select.Option>
              <Select.Option value="member">Üye</Select.Option>
              <Select.Option value="secretary">Sekreter</Select.Option>
              <Select.Option value="treasurer">Sayman</Select.Option>
              <Select.Option value="commission">Komisyon</Select.Option>
              <Select.Option value="sector_board">Sektör Kurulu</Select.Option>
              <Select.Option value="honorary">Onursal Üye</Select.Option>
              <Select.Option value="other">Diğer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="order"
            label="Sıra"
            rules={[{ required: true, message: 'Sıra gerekli' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMember ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Şema Ayarları Modal */}
      <Modal
        title="Organizasyon Şeması Ayarları"
        open={schemeVisible}
        onCancel={() => setSchemeVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={schemeForm}
          layout="vertical"
          onFinish={handleSchemeSubmit}
        >
          <Form.Item
            label="Şema Görseli"
          >
            <Upload {...schemeUploadProps}>
              <Button icon={<UploadOutlined />} loading={schemeUploading}>
                Şema Görseli Yükle
              </Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Desteklenen formatlar: JPG, PNG, GIF, PDF. Maksimum dosya boyutu: 5MB<br/>
              💡 <strong>İpucu:</strong> PowerPoint varsa PDF'e çevirip yükleyin!
            </div>
            {schemeUploadedImageUrl && (
              <div style={{ marginTop: 8 }}>
                {schemeUploadedImageUrl.toLowerCase().includes('.pdf') ? (
                  <div style={{
                    width: 300,
                    height: 200,
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                  }}>
                    <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '8px' }}>📄</div>
                    <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                      PDF Dosyası<br />
                      <a href={schemeUploadedImageUrl} target="_blank" rel="noopener noreferrer">
                        Dosyayı İndir veya Aç
                      </a>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={schemeUploadedImageUrl}
                    alt="Yüklenen şema görseli"
                    width={300}
                    height={200}
                    style={{ objectFit: 'contain', border: '1px solid #d9d9d9', borderRadius: '8px' }}
                  />
                )}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="schemeUrlMan"
            label="Şema Görsel URL (Alternatif)"
          >
            <Input placeholder="Ya da şema görselinin URL'sini direkt girebilirsiniz" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <Input placeholder="Şema ile ilgili açıklama (opsiyonel)" />
          </Form.Item>

          {schemeData?.schemeUrl && (
            <Form.Item label="Mevcut Şema">
              <Image
                src={schemeData.schemeUrl}
                alt="Organizasyon Şeması"
                width={400}
                style={{ objectFit: 'contain', border: '1px solid #d9d9d9', borderRadius: '8px' }}
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setSchemeVisible(false)}>
                İptal
              </Button>
              <Button type="primary" htmlType="submit">
                Kaydet
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Organizasyon;
