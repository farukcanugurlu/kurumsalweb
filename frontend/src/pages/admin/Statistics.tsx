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
  ColorPicker,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DragOutlined
} from '@ant-design/icons';
import { Statistic } from '../../types';
import { statisticsApi } from '../../services/api';

const { Option } = Select;

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await statisticsApi.getAll();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      message.error('İstatistikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStatistic(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (statistic: Statistic) => {
    setEditingStatistic(statistic);
    form.setFieldsValue(statistic);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await statisticsApi.delete(id);
      if (response.data.success) {
        message.success('İstatistik silindi');
        fetchStatistics();
      } else {
        message.error('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      message.error('Silme işlemi sırasında hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = {
        ...values,
        id: editingStatistic?.id || 0,
        isActive: values.isActive !== undefined ? values.isActive : true
      };

      let response;
      if (editingStatistic) {
        response = await statisticsApi.update(editingStatistic.id, submitData);
      } else {
        response = await statisticsApi.create(submitData);
      }

      if (response.data.success) {
        message.success(editingStatistic ? 'İstatistik güncellendi' : 'İstatistik eklendi');
        setModalVisible(false);
        fetchStatistics();
      } else {
        message.error('İşlem başarısız');
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error('İşlem sırasında hata oluştu');
    }
  };

  const handleReorder = async (newStatistics: Statistic[]) => {
    try {
      const reorderData = newStatistics.map((stat, index) => ({
        ...stat,
        order: index + 1
      }));

      const response = await statisticsApi.reorder(reorderData);
      if (response.data.success) {
        setStatistics(response.data.data);
        message.success('Sıralama güncellendi');
      }
    } catch (error) {
      console.error('Reorder error:', error);
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
        <span style={{ color: '#666' }}>{order}</span>
      )
    },
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Değer',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{value}</span>
      )
    },
    {
      title: 'İkon',
      dataIndex: 'icon',
      key: 'icon',
      width: 120,
      render: (icon: string) => (
        <span style={{ color: '#666' }}>{icon || '-'}</span>
      )
    },
    {
      title: 'Renk',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => (
        <div style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: color || '#1890ff', 
          borderRadius: 4,
          border: '1px solid #d9d9d9'
        }} />
      )
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
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_: any, record: Statistic) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bu istatistiği silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const iconOptions = [
    { value: 'UserOutlined', label: 'Kullanıcı' },
    { value: 'CalendarOutlined', label: 'Takvim' },
    { value: 'RightOutlined', label: 'Ok' },
    { value: 'TrophyOutlined', label: 'Kupa' },
    { value: 'TeamOutlined', label: 'Takım' },
    { value: 'HeartOutlined', label: 'Kalp' },
    { value: 'BulbOutlined', label: 'Ampul' },
    { value: 'EyeOutlined', label: 'Göz' },
    { value: 'AimOutlined', label: 'Hedef' },
    { value: 'PhoneOutlined', label: 'Telefon' },
    { value: 'MailOutlined', label: 'Mail' },
    { value: 'EnvironmentOutlined', label: 'Konum' }
  ];

  return (
    <div>
      <Card
        title="İstatistikler"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni İstatistik
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={statistics}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Card>

      <Modal
        title={editingStatistic ? 'İstatistik Düzenle' : 'Yeni İstatistik'}
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
            <Input placeholder="Örn: Aktif Üye" />
          </Form.Item>

          <Form.Item
            name="value"
            label="Değer"
            rules={[{ required: true, message: 'Değer gerekli' }]}
          >
            <InputNumber
              placeholder="Örn: 150"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="İkon"
          >
            <Select
              placeholder="İkon seçin"
              allowClear
            >
              {iconOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="Renk"
          >
            <ColorPicker
              showText
              format="hex"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="order"
            label="Sıra"
            rules={[{ required: true, message: 'Sıra gerekli' }]}
          >
            <InputNumber
              placeholder="Örn: 1"
              style={{ width: '100%' }}
              min={1}
            />
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
                {editingStatistic ? 'Güncelle' : 'Ekle'}
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

export default Statistics;
