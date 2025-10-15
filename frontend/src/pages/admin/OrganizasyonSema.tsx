import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  message, 
  Popconfirm,
  Space
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined
} from '@ant-design/icons';
import { OrganizationChart } from '../../types';
import { organizationChartApi } from '../../services/api';

const { Option } = Select;

const OrganizasyonSema: React.FC = () => {
  const [charts, setCharts] = useState<OrganizationChart[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChart, setEditingChart] = useState<OrganizationChart | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const response = await organizationChartApi.getAllForAdmin();
      if (response.data.success) {
        setCharts(response.data.data);
      }
    } catch (error) {
      message.error('Organizasyon şeması yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingChart(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (chart: OrganizationChart) => {
    setEditingChart(chart);
    form.setFieldsValue({
      title: chart.title,
      parentId: chart.parentId,
      order: chart.order,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await organizationChartApi.delete(id);
      message.success('Organizasyon şeması silindi');
      fetchCharts();
      // Sayfayı yenile
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error('Organizasyon şeması silinirken hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const chartData = {
        title: values.title,
        parentId: values.parentId || null,
        order: values.order || 0,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      if (editingChart) {
        const updateData = { ...chartData, id: editingChart.id };
        await organizationChartApi.update(editingChart.id, updateData);
        message.success('Organizasyon şeması güncellendi');
      } else {
        await organizationChartApi.create(chartData);
        message.success('Organizasyon şeması eklendi');
      }

      setModalVisible(false);
      form.resetFields();
      fetchCharts();
    } catch (error) {
      message.error('İşlem sırasında hata oluştu');
    }
  };


  const columns = [
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <div style={{ fontWeight: 'bold' }}>{text}</div>
      ),
    },
    {
      title: 'Üst Öğe',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: number) => {
        const parent = charts.find(c => c.id === parentId);
        return parent ? parent.title : '-';
      },
    },
    {
      title: 'Sıra',
      dataIndex: 'order',
      key: 'order',
      width: 80,
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
      render: (_: any, record: OrganizationChart) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Bu organizasyon şemasını silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="text"
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
            <h2>Organizasyon Şeması Yönetimi</h2>
            <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
              Toplam: {charts.length} öğe | 
              Aktif: {charts.filter(c => c.isActive).length} | 
              Pasif: {charts.filter(c => !c.isActive).length}
            </div>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Yeni Öğe Ekle
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={charts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingChart ? 'Organizasyon Şeması Düzenle' : 'Yeni Organizasyon Şeması Ekle'}
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
            <Input placeholder="Örn: GENEL KURUL, YÖNETİM KURULU, KOMİSYONLAR" />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="Üst Öğe"
          >
            <Select placeholder="Üst öğe seçin (isteğe bağlı)" allowClear>
              {charts.map(chart => (
                <Option key={chart.id} value={chart.id}>
                  {chart.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="order"
            label="Sıra"
            rules={[{ required: true, message: 'Sıra gerekli' }]}
          >
            <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingChart ? 'Güncelle' : 'Ekle'}
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

export default OrganizasyonSema;
