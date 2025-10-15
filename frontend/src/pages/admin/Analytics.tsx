import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker, 
  Table, 
  Progress, 
  Tag,
  Spin,
  Alert,
  Typography,
  Space,
  Button,
  Tooltip
} from 'antd';
import { 
  EyeOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  GlobalOutlined,
  MobileOutlined,
  DesktopOutlined,
  TabletOutlined,
  ReloadOutlined,
  BarChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { analyticsApi, AnalyticsSummary, ChartDataPoint, RealtimeData } from '../../services/analyticsApi';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const { Title: AntTitle, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [selectedChartPeriod, setSelectedChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartDays, setChartDays] = useState(30);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchRealtimeData, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [selectedPeriod, selectedChartPeriod, chartDays]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSummary(),
        fetchChartData(),
        fetchRealtimeData()
      ]);
    } catch (error) {
      console.error('Analytics data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    const data = await analyticsApi.getSummary(selectedPeriod);
    setSummary(data);
  };

  const fetchChartData = async () => {
    const data = await analyticsApi.getChartData(selectedChartPeriod, chartDays);
    setChartData(data);
  };

  const fetchRealtimeData = async () => {
    const data = await analyticsApi.getRealtimeData();
    setRealtimeData(data);
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <MobileOutlined style={{ color: '#1890ff' }} />;
      case 'tablet': return <TabletOutlined style={{ color: '#52c41a' }} />;
      case 'desktop': return <DesktopOutlined style={{ color: '#fa8c16' }} />;
      default: return <GlobalOutlined />;
    }
  };

  const getBrowserColor = (browser: string) => {
    const colors: { [key: string]: string } = {
      'Chrome': '#4285f4',
      'Firefox': '#ff9500',
      'Safari': '#1dbe6b',
      'Edge': '#0078d4',
      'Opera': '#ff1b2d'
    };
    return colors[browser] || '#666';
  };

  // Grafik verilerini hazırla
  const lineChartData = {
    labels: chartData.map(d => {
      if (selectedChartPeriod === 'monthly') return d.date;
      return dayjs(d.date).format('MMM DD');
    }),
    datasets: [
      {
        label: 'Sayfa Görüntüleme',
        data: chartData.map(d => d.pageViews),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Benzersiz Ziyaretçi',
        data: chartData.map(d => d.uniqueVisitors),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Oturum',
        data: chartData.map(d => d.sessions),
        borderColor: '#fa8c16',
        backgroundColor: 'rgba(250, 140, 22, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const deviceChartData = summary ? {
    labels: summary.deviceTypes.map(d => d.device),
    datasets: [
      {
        data: summary.deviceTypes.map(d => d.count),
        backgroundColor: ['#1890ff', '#52c41a', '#fa8c16'],
        borderWidth: 0,
      },
    ],
  } : null;

  const browserChartData = summary ? {
    labels: summary.browsers.map(b => b.browser),
    datasets: [
      {
        data: summary.browsers.map(b => b.count),
        backgroundColor: summary.browsers.map(b => getBrowserColor(b.browser)),
        borderWidth: 0,
      },
    ],
  } : null;

  const realtimeChartData = realtimeData ? {
    labels: realtimeData.hourlyData.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: 'Ziyaretçi',
        data: realtimeData.hourlyData.map(d => d.visitors),
        backgroundColor: 'rgba(24, 144, 255, 0.8)',
        borderColor: '#1890ff',
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ziyaretçi İstatistikleri',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const topPagesColumns = [
    {
      title: 'Sayfa',
      dataIndex: 'page',
      key: 'page',
      render: (text: string) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {text === '/' ? 'Ana Sayfa' : text}
        </Text>
      ),
    },
    {
      title: 'Görüntüleme',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => (
        <Tag color="blue">{views.toLocaleString()}</Tag>
      ),
    },
  ];

  const topCountriesColumns = [
    {
      title: 'Ülke',
      dataIndex: 'country',
      key: 'country',
      render: (text: string) => (
        <Space>
          <GlobalOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Ziyaretçi',
      dataIndex: 'visitors',
      key: 'visitors',
      render: (visitors: number) => (
        <Tag color="green">{visitors.toLocaleString()}</Tag>
      ),
    },
  ];

  if (loading && !summary) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>
          <Text>Analytics verileri yükleniyor...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AntTitle level={2}>
          <BarChartOutlined /> Web Sitesi Analytics
        </AntTitle>
        <Space>
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 120 }}
          >
            <Option value="daily">Günlük</Option>
            <Option value="weekly">Haftalık</Option>
            <Option value="monthly">Aylık</Option>
            <Option value="yearly">Yıllık</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
            loading={loading}
          >
            Yenile
          </Button>
        </Space>
      </div>

      {!summary && (
        <Alert
          message="Analytics Verisi Bulunamadı"
          description="Henüz ziyaretçi verisi bulunmuyor. Web sitesi trafiği başladığında burada görüntülenecek."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {summary && (
        <>
          {/* Özet İstatistikler */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Toplam Sayfa Görüntüleme"
                  value={summary.totalPageViews}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Benzersiz Ziyaretçi"
                  value={summary.totalUniqueVisitors}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Toplam Oturum"
                  value={summary.totalSessions}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Ortalama Oturum Süresi"
                  value={Math.round(summary.averageSessionDuration)}
                  suffix="saniye"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Gerçek Zamanlı Veriler */}
          {realtimeData && (
            <Card title="Gerçek Zamanlı Ziyaretçiler" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Şu Anda Aktif"
                    value={realtimeData.currentVisitors}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#f5222d', fontSize: '24px' }}
                  />
                </Col>
                <Col xs={24} md={16}>
                  {realtimeChartData && (
                    <Bar data={realtimeChartData} options={pieOptions} />
                  )}
                </Col>
              </Row>
            </Card>
          )}

          {/* Grafikler */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card 
                title="Ziyaretçi Trendi"
                extra={
                  <Space>
                    <Select
                      value={selectedChartPeriod}
                      onChange={setSelectedChartPeriod}
                      style={{ width: 100 }}
                    >
                      <Option value="daily">Günlük</Option>
                      <Option value="weekly">Haftalık</Option>
                      <Option value="monthly">Aylık</Option>
                    </Select>
                    <Select
                      value={chartDays}
                      onChange={setChartDays}
                      style={{ width: 80 }}
                    >
                      <Option value={7}>7 gün</Option>
                      <Option value={30}>30 gün</Option>
                      <Option value={90}>90 gün</Option>
                    </Select>
                  </Space>
                }
              >
                <Line data={lineChartData} options={chartOptions} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Cihaz Dağılımı">
                {deviceChartData && (
                  <Doughnut data={deviceChartData} options={pieOptions} />
                )}
              </Card>
            </Col>
          </Row>

          {/* Tablolar */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="En Çok Ziyaret Edilen Sayfalar">
                <Table
                  columns={topPagesColumns}
                  dataSource={summary.topPages.map((page, index) => ({
                    key: index,
                    ...page
                  }))}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Ülke Dağılımı">
                <Table
                  columns={topCountriesColumns}
                  dataSource={summary.topCountries.map((country, index) => ({
                    key: index,
                    ...country
                  }))}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          {/* Tarayıcı İstatistikleri */}
          <Card title="Tarayıcı Dağılımı" style={{ marginTop: '16px' }}>
            <Row gutter={16}>
              {summary.browsers.map((browser, index) => (
                <Col xs={12} sm={8} md={4} key={index}>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      backgroundColor: getBrowserColor(browser.browser),
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {browser.browser.charAt(0)}
                    </div>
                    <Text strong>{browser.browser}</Text>
                    <br />
                    <Text type="secondary">{browser.count} ziyaretçi</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </>
      )}
    </div>
  );
};

export default Analytics;
