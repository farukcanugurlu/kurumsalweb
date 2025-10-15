import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Table, 
  Space, 
  Modal,
  Typography,
  Tag
} from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { OrganizationSettings } from '../../types';
import { siteSettingsApi } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<OrganizationSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSetting, setEditingSetting] = useState<OrganizationSettings | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await siteSettingsApi.getAll();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      message.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSetting(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (setting: OrganizationSettings) => {
    setEditingSetting(setting);
    form.setFieldsValue({
      key: setting.key,
      value: setting.value,
      description: setting.description
    });
    setModalVisible(true);
  };

  const handleDelete = async (key: string) => {
    try {
      await siteSettingsApi.delete(key);
      message.success('Ayar silindi');
      fetchSettings();
    } catch (error) {
      message.error('Ayar silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await siteSettingsApi.createOrUpdate(values);
      message.success(editingSetting ? 'Ayar güncellendi' : 'Ayar oluşturuldu');
      setModalVisible(false);
      fetchSettings();
    } catch (error) {
      message.error('İşlem sırasında hata oluştu');
    }
  };

  const columns = [
    {
      title: 'Anahtar',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => <Tag color="blue">{key}</Tag>
    },
    {
      title: 'Değer',
      dataIndex: 'value',
      key: 'value',
      render: (value: string) => (
        <div style={{ maxWidth: 300, wordBreak: 'break-word' }}>
          {value || '-'}
        </div>
      )
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description || '-'
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: OrganizationSettings) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Düzenle
          </Button>
          <Button 
            type="primary" 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Sil
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3}>Site Ayarları</Title>
          <Button 
            type="primary" 
            icon={<SettingOutlined />}
            onClick={handleAdd}
          >
            Yeni Ayar Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={settings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingSetting ? 'Ayar Düzenle' : 'Yeni Ayar Ekle'}
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
            name="key"
            label="Ayar Anahtarı"
            rules={[{ required: true, message: 'Ayar anahtarı gerekli' }]}
            help="Örnek: site_description, site_title, contact_email"
          >
            <Input placeholder="site_description" />
          </Form.Item>

          <Form.Item
            name="value"
            label="Değer"
          >
            <TextArea rows={4} placeholder="Ayar değerini girin" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
          >
            <Input placeholder="Bu ayarın ne için kullanıldığını açıklayın" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSetting ? 'Güncelle' : 'Kaydet'}
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

export default SiteSettings;
