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
  InputNumber,
  message,
  Popconfirm,
  Card,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ContactInfo } from '../../types';
import { contactApi } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

const Iletisim: React.FC = () => {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInfo, setEditingInfo] = useState<ContactInfo | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContactInfos();
  }, []);

  const fetchContactInfos = async () => {
    setLoading(true);
    try {
      const response = await contactApi.getInfo();
      if (response.data.success) {
        setContactInfos(response.data.data);
      }
    } catch (error) {
      message.error('İletişim bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingInfo(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ContactInfo) => {
    setEditingInfo(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const updatedInfos = contactInfos.filter(info => info.id !== id);
      await contactApi.updateInfo(updatedInfos);
      message.success('İletişim bilgisi silindi');
      fetchContactInfos();
    } catch (error) {
      message.error('İletişim bilgisi silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      let updatedInfos;
      
      // URL alanını dahil et
      const formData = {
        ...values,
        url: values.url || null // URL alanını dahil et
      };
      
      if (editingInfo) {
        // Mevcut kaydı güncelle
        updatedInfos = contactInfos.map(info => 
          info.id === editingInfo.id ? { ...info, ...formData } : info
        );
      } else {
        // Yeni kayıt ekle (ID'yi backend otomatik atayacak)
        updatedInfos = [...contactInfos, { ...formData, id: 0 }];
      }

      const response = await contactApi.updateInfo(updatedInfos);
      
      if (response.data.success) {
        message.success('İletişim bilgisi kaydedildi');
        setModalVisible(false);
        fetchContactInfos();
      } else {
        message.error('Kaydetme işlemi başarısız');
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error('İşlem sırasında hata oluştu');
    }
  };

  const columns = [
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeLabels: { [key: string]: string } = {
          'phone': 'Telefon',
          'email': 'E-posta',
          'address': 'Adres',
          'social': 'Sosyal Medya',
          'working-hours': 'Çalışma Saatleri'
        };
        return typeLabels[type] || type;
      }
    },
    {
      title: 'Etiket',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Değer',
      dataIndex: 'value',
      key: 'value',
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
      render: (_: any, record: ContactInfo) => (
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
            title="Bu iletişim bilgisini silmek istediğinizden emin misiniz?"
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
          <Title level={3}>İletişim Bilgileri Yönetimi</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni İletişim Bilgisi Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={contactInfos}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingInfo ? 'İletişim Bilgisi Düzenle' : 'Yeni İletişim Bilgisi Ekle'}
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
            name="type"
            label="Tür"
            rules={[{ required: true, message: 'Tür gerekli' }]}
          >
            <Select>
              <Option value="phone">Telefon</Option>
              <Option value="email">E-posta</Option>
              <Option value="address">Adres</Option>
              <Option value="social">Sosyal Medya</Option>
              <Option value="working-hours">Çalışma Saatleri</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="label"
            label="Etiket"
            rules={[{ required: true, message: 'Etiket gerekli' }]}
          >
            <Input placeholder="Ana Telefon" />
          </Form.Item>

          <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'social') {
                return (
                  <>
                    <Form.Item
                      name="value"
                      label="Görünen Ad"
                      rules={[{ required: true, message: 'Görünen ad gerekli' }]}
                      extra="Kullanıcıların göreceği ad (örn: @kurumsalwebsitesi, kurumsalwebsitesi)"
                    >
                      <Input placeholder="@kurumsalwebsitesi" />
                    </Form.Item>
                    <Form.Item
                      name="url"
                      label="Sosyal Medya URL'si"
                      rules={[
                        { required: true, message: 'URL gerekli' },
                        { type: 'url', message: 'Geçerli bir URL girin (örn: https://instagram.com/kurumsalwebsitesi)' }
                      ]}
                      extra="Tıklayınca açılacak tam URL (örn: https://instagram.com/kurumsalwebsitesi)"
                    >
                      <Input placeholder="https://instagram.com/kurumsalwebsitesi" />
                    </Form.Item>
                  </>
                );
              }
              return (
                <Form.Item
                  name="value"
                  label="Değer"
                  rules={[{ required: true, message: 'Değer gerekli' }]}
                >
                  <Input placeholder="+90 312 000 00 00" />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Aktif"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* Koordinat alanları - sadece address type için göster */}
          <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'address') {
                return (
                  <>
                    <Form.Item
                      name="latitude"
                      label="Enlem (Latitude)"
                      rules={[
                        { type: 'number', min: -90, max: 90, message: 'Enlem -90 ile 90 arasında olmalı' }
                      ]}
                    >
                      <InputNumber 
                        placeholder="41.0082" 
                        style={{ width: '100%' }}
                        precision={6}
                      />
                    </Form.Item>

                    <Form.Item
                      name="longitude"
                      label="Boylam (Longitude)"
                      rules={[
                        { type: 'number', min: -180, max: 180, message: 'Boylam -180 ile 180 arasında olmalı' }
                      ]}
                    >
                      <InputNumber 
                        placeholder="28.9784" 
                        style={{ width: '100%' }}
                        precision={6}
                      />
                    </Form.Item>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingInfo ? 'Güncelle' : 'Kaydet'}
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

export default Iletisim;
