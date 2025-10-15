import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { Page } from '../../types';
import { pagesApi } from '../../services/api';
import PageRenderer from '../../components/PageRenderer';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);

  const fetchPage = async (pageSlug: string) => {
    try {
      setLoading(true);
      const response = await pagesApi.getBySlug(pageSlug);
      if (response.data.success) {
        setPage(response.data.data);
        setError(null);
      } else {
        setError('Sayfa bulunamadı');
      }
    } catch (error) {
      console.error('Sayfa yüklenirken hata:', error);
      setError('Sayfa yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Aradığınız sayfa bulunamadı."
        extra={
          <Button type="primary" href="/">
            Ana Sayfaya Dön
          </Button>
        }
      />
    );
  }

  return <PageRenderer page={page} />;
};

export default DynamicPage;