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
  Select
} from 'antd';

import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MenuItem } from '../../types';
import { menuApi } from '../../services/api';

const { Option } = Select;

const { Title } = Typography;

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await menuApi.getAllForAdmin();
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      message.error('Menü öğeleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: MenuItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await menuApi.delete(id);
      message.success('Menü öğesi silindi');
      fetchMenuItems();
    } catch (error) {
      message.error('Menü öğesi silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        // Edit işleminde ID'yi dahil et
        const updateData = { ...values, id: editingItem.id };
        await menuApi.update(editingItem.id, updateData);
        message.success('Menü öğesi güncellendi');
      } else {
        await menuApi.create(values);
        message.success('Menü öğesi eklendi');
      }

      setModalVisible(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Menu update error:', error);
      message.error('İşlem sırasında hata oluştu');
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
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Sıra',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Tip',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: number | null) => (
        <span style={{ 
          backgroundColor: parentId ? '#f0f0ff' : '#f0fff0', 
          padding: '2px 8px', 
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {parentId ? 'Alt Menü' : 'Ana Menü'}
        </span>
      )
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
      render: (_: any, record: MenuItem) => (
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
            title="Bu menü öğesini silmek istediğinizden emin misiniz?"
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
          <Title level={3}>Menü Yönetimi</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni Menü Öğesi Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={menuItems}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Menü Öğesi Düzenle' : 'Yeni Menü Öğesi Ekle'}
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
            name="title"
            label="Başlık"
            rules={[{ required: true, message: 'Başlık gerekli' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: 'URL gerekli' }]}
          >
            <Input placeholder="/hakkimizda" />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="Ana Menü Öğesi (Opsiyonel)"
          >
            <Select 
              placeholder="Alt menü için ana menü seçin"
              allowClear
            >
              {menuItems
                .filter(item => !item.parentId) // Sadece ana menü öğelerini göster
                .map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))
              }
            </Select>
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
                {editingItem ? 'Güncelle' : 'Kaydet'}
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

export default Menu;
