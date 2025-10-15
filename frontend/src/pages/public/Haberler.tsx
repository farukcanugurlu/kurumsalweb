import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Tag,
  Pagination,
  Input,
  Select,
  Empty,
  Spin,
  Modal
} from 'antd';
import { useLocation } from 'react-router-dom';
import { 
  CalendarOutlined, 
  EyeOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { News, Page } from '../../types';
import { newsApi, pagesApi } from '../../services/api';
import { getNewsImageUrl } from '../../utils/imageUrl';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Haberler: React.FC = () => {
  const location = useLocation();
  const [news, setNews] = useState<News[]>([]);
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchPageContent();
  }, [currentPage, pageSize, searchTerm, selectedCategory]);

  // Ana sayfadan gelen parametreleri kontrol et
  useEffect(() => {
    const selectedNewsId = location.state?.selectedNewsId;
    const selectedNewsItem = location.state?.selectedNews;
    const filterCategory = location.state?.filterCategory;
    
    if (selectedNewsId && news.length > 0) {
      const newsItem = news.find(n => n.id === selectedNewsId);
      if (newsItem) {
        setSelectedNews(newsItem);
        setModalVisible(true);
      }
    }
    
    if (selectedNewsItem) {
      setSelectedNews(selectedNewsItem);
      setModalVisible(true);
    }
    
    if (filterCategory) {
      setSelectedCategory(filterCategory);
    }
  }, [location.state, news]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsApi.getAll();
      if (response.data.success) {
        let filteredNews = response.data.data;

        // Arama filtresi
        if (searchTerm) {
          filteredNews = filteredNews.filter(news =>
            news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (news.summary && news.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
            news.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Kategori filtresi
        if (selectedCategory) {
          filteredNews = filteredNews.filter(news =>
            news.category === selectedCategory
          );
        }

        setNews(filteredNews);
      }
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async () => {
    try {
      const response = await pagesApi.getAll();
      if (response.data.success) {
        // Haberler sayfasını bul (slug: 'haberler' veya title: 'Haberler')
        const haberlerPage = response.data.data.find(
          (page: Page) => page.slug === 'haberler' || page.title.toLowerCase().includes('haberler')
        );
        setPageContent(haberlerPage || null);
      }
    } catch (error) {
      console.error('Sayfa içeriği yüklenirken hata:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Genel': 'blue',
      'Etkinlik': 'green',
      'Duyuru': 'orange',
      'Haber': 'red',
      'Proje': 'purple'
    };
    return colors[category] || 'default';
  };

  const paginatedNews = news.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const categories = Array.from(new Set(news.map(item => item.category)));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 48,
        padding: '32px 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '8px'
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          {pageContent?.title || 'Haberler'}
        </Title>
        {pageContent?.content && (
          <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
            <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
          </Paragraph>
        )}
      </div>

      {/* Filtreler */}
      <Card style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Haber ara..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Kategori seçin"
              allowClear
              size="large"
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
              suffixIcon={<FilterOutlined />}
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#666' }}>
                Toplam {news.length} haber bulundu
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Haberler */}
      <Spin spinning={loading}>
        {paginatedNews.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedNews.map((newsItem) => (
                <Col xs={24} md={12} lg={8} key={newsItem.id}>
                  <Card
                    hoverable
                    style={{ height: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedNews(newsItem);
                      setModalVisible(true);
                    }}
                    cover={
                      <img
                        alt={newsItem.title}
                        src={getNewsImageUrl(newsItem.imageUrl)}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNews(newsItem);
                          setModalVisible(true);
                        }}
                      >
                        Devamını Oku
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div>
                          <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                            {newsItem.title}
                          </Title>
                          <Tag color={getCategoryColor(newsItem.category)}>
                            {newsItem.category}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 16 }}>
                            {newsItem.summary}
                          </Paragraph>
                          <div style={{ 
                            color: '#999',
                            fontSize: '12px'
                          }}>
                            <CalendarOutlined /> {dayjs(newsItem.publishDate).format('DD.MM.YYYY')}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={currentPage}
                total={news.length}
                pageSize={pageSize}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 6);
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} / ${total} haber`
                }
                pageSizeOptions={['6', '12', '24', '48']}
              />
            </div>
          </>
        ) : (
          <Empty
            description="Henüz haber bulunmuyor"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>

      {/* Son Haberler */}
      {news.length > 0 && (
        <Card style={{ marginTop: 48 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            Son Haberler
          </Title>
          <Row gutter={[24, 24]}>
            {news.slice(0, 3).map((newsItem) => (
              <Col xs={24} md={8} key={newsItem.id}>
                <Card
                  size="small"
                  hoverable
                  cover={
                    <img
                      alt={newsItem.title}
                      src={getNewsImageUrl(newsItem.imageUrl)}
                      style={{ height: 150, objectFit: 'cover' }}
                    />
                  }
                >
                  <Card.Meta
                    title={
                      <Title level={5} style={{ margin: 0 }}>
                        {newsItem.title}
                      </Title>
                    }
                    description={
                      <div>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                          {newsItem.summary}
                        </Paragraph>
                        <div style={{ color: '#999', fontSize: '12px' }}>
                          <CalendarOutlined /> {dayjs(newsItem.publishDate).format('DD.MM.YYYY')}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Haber Detay Modal */}
      <Modal
        title={selectedNews?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Kapat
          </Button>
        ]}
        width={800}
      >
        {selectedNews && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <img
                src={getNewsImageUrl(selectedNews.imageUrl)}
                alt={selectedNews.title}
                style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Tag color={getCategoryColor(selectedNews.category)}>
                {selectedNews.category}
              </Tag>
              <span style={{ marginLeft: 16, color: '#999' }}>
                <CalendarOutlined /> {dayjs(selectedNews.publishDate).format('DD.MM.YYYY')}
              </span>
            </div>
            {selectedNews.summary && (
              <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ marginBottom: 8, color: '#1890ff' }}>
                  Özet
                </Title>
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedNews.summary }}
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                    fontStyle: 'italic',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1890ff'
                  }}
                />
              </div>
            )}
            {selectedNews.content && (
              <div 
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: '#333'
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Haberler;
